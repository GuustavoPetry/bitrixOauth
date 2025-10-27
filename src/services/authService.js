const axios = require("axios");
const { CLIENT_ID, CLIENT_SECRET, BITRIX_PORTAL } = process.env;

async function exchangeCodeForToken(code, redirectUri) {
    const url = `${BITRIX_PORTAL}/oauth/token/`;
    const params = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
    });

    const response = await axios.post(url, params.toString(), {
        headers: "Content-Type: application/x-www-form-urlencoded"
    });

    return response.data;
}

async function refreshTokens(refreshToken) {
    const url = `${BITRIX_PORTAL}/oauth/token/`;
    const params = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken
    });

    const response = await axios.post(url, params.toString(), {
        headers: "Content-Type: application/x-www-form-urlencoded"
    });

    return response.data;
}

module.exports = {
    exchangeCodeForToken,
    refreshTokens
};