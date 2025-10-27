const { getCurrentUser } = require("../services/authService");
const Token = require("../models/tokenModel");

exports.getUser = async (_, res) => {
    try {
        const tokens = await Token.getTokens();
        if (!tokens?.access_token) return res.status(401).send("Não Autorizado");

        const data = await getCurrentUser(tokens.access_token);
        res.json(data);
    } catch (e) {
        console.error("Erro ao chama APi Bitrix: ", e.response?.data || e.message);
        res.status(500).send("Erro na APi Bitrix");
    }
};

