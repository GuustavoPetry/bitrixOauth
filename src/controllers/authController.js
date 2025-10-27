require("dotenv").config();
const { exchangeCodeForToken, refreshTokens } = require("../services/authService");
const Token = require("../models/tokenModel");

const { CLIENT_ID, BITRIX_PORTAL, REDIRECT_URI } = process.env;

exports.startAuth = (req, res) => {
    if (!CLIENT_ID || !BITRIX_PORTAL) {
        console.error("Erro: CLIENT_ID ou BITRIX_PORTAL não definidos no .env");
        return res.status(500).send("Configuração incompleta do .env");
    }

    const state = Math.random().toString(36).slice(2);
    req.session.oauth_state = state;

    const authUrl = `${BITRIX_PORTAL}/oauth/authorize?client_id=${encodeURIComponent(CLIENT_ID)}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    res.redirect(authUrl);
};

exports.handleCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        if(!code || state !== req.session.oauth_state) {
            return res.status(400).send("State inválido ou Code ausente");
        }

        const tokens = await exchangeCodeForToken(code, REDIRECT_URI);

        await Token.saveTokens(tokens);

        res.send("Autorizado com Sucesso. Tokens salvos no Banco.");
    } catch(e) {
        console.error("Erro no Callback", e.response?.data || e.message);
        res.status(500).send("Erro ao trocar Code por Token"); 
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const current = await Token.getTokens();
        if(!current?.refresh_token) return res.status(400).send("Sem refresh_token");

        const newTokens = await refreshTokens(current.refresh_token);
        await Token.saveTokens(newTokens);

        res.json(newTokens);
    } catch(e) {
        console.error("Erro ao renovar Token", e.response?.data || e.message);
        return res.status(500).send("Erro ao renovar Token");
    }
};