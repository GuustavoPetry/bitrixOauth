require("dotenv").config();
const express = require("express");
const axios = require("axios");
const session = require("express-session");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

const {
    CLIENT_ID,
    CLIENT_SECRET,
    BITRIX_PORTAL,
    PORT
} = process.env;

app.get("/auth/start", (req, res) => {
    const redirectUri = `${req.protocol}://${req.get("host")}/auth/callback`;
    const state = Math.random().toString(36).slice(2);
    req.session.oauth_state = state;

    const authUrl = `${BITRIX_PORTAL}/oauth/authorize?client_id=${encodeURIComponent(CLIENT_ID)}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code || state !== req.session.oauth_state) {
            return res.status(400).send("State inválido ou Code ausente");
        }

        // Troca código por Token
        const tokenUrl = `${BITRIX_PORTAL}/oauth/token/`;
        const redirectUri = `${req.protocol}://${req.get("host")}/auth/callback`;

        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", CLIENT_ID);
        params.append("client_secret", CLIENT_SECRET);
        params.append("code", code);
        params.append("redirect_uri", redirectUri);

        const tokenResp = await axios.post(tokenUrl, params.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        console.log("Sessão antes do callback:", req.session);
        // tokenResp.data contém access_token, refresh_token, expires_in, etc.
        req.session.tokens = tokenResp.data;
        console.log("Sessão depois de salvar tokens:", req.session);

        res.send("Autorizado com Sucesso - Pode fechar esta janela. Tokens salvos na sessão");
    } catch (e) {
        console.error("Erro no Callback:", e.response?.data || e.message);
        res.status(500).send("Erro ao trocar Code por Token");
    }
});

// Exemplo de rota que usa acess_token
app.get("/bitrix/me", async (req, res) => {    
    try {
        if (!req.session.tokens) return res.status(401).send("Não Autorizado. Faça /auth/start");
        const access_token = req.session.tokens.access_token;

        // Requisição a API
        const apiUrl = `${BITRIX_PORTAL}/rest/user.current.json?auth=${encodeURIComponent(access_token)}`;
        const result = await axios.get(apiUrl);
        res.json(result.data);
    } catch (e) {
        console.error("Erro ao chamar APi Bitrix", e.response?.data || e.message);
        res.status(500).send("Erro na APi Bitrix");
    }
});

// Refresh Token - troca refresh_token por novo acess_token
async function refreshTokens(refreshToken) {
    const tokenUrl = `${BITRIX_PORTAL}/oauth/token`;
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("refresh_token", refreshToken);

    const resp = await axios.post(tokenUrl, params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    return resp.data;
}

// Rota para forçar refresh manual
app.get("/auth/refresh", async (req, res) => {
    try {
        if (!req.session.tokens?.refresh_token) return res.status(400).send("Sem refresh_token");

        const newTokens = await refreshTokens(req.session.tokens.refresh_token);
        req.session.tokens = newTokens;
        res.json(newTokens);
    } catch (e) {
        console.error("Erro Refresh: ", e.response?.data || e.message);
        res.status(500).send("Erro ao renovar Token");
    }
});
app.listen(PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}`));


