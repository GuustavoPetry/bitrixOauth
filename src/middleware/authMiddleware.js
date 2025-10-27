const Token = require("../models/tokenModel");
const { refreshTokens } = require("../services/authService");

/**
 * Middleware global que executa antes das rotas protegidas.
 * Atualiza o access_token se estiver expirado.
 */
module.exports = async (req, res, next) => {
    try {
        const tokens = await Token.getTokens();
        if (!tokens) return res.status(401).send("Não Autorizado");

        const elapsed = (Date.now() - tokens.created_at) / 1000;
        if (elapsed >= tokens.expires_in - 60) {
            // Se token estiver expirado executa refresh
            const newTokens = await refreshTokens(tokens.refresh_token);
            await Token.saveTokens(newTokens);
            console.log("Token Renovado Automaticamente");
        }

        next();

    } catch (e) {
        console.error("Erro no Middleware de Autenticação", e.message);
        res.status(500).send("Erro interno de autenticação");
    }
};