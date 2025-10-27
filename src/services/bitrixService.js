const axios = require("axios");
const { BITRIX_PORTAL } = process.env;

async function getCurrentUser(access_token){
    const url = `${BITRIX_PORTAL}/rest/user.current.json?auth=${encodeURIComponent(access_token)}`;
    const response = await axios.post(url);
    return response.data;
}

module.exports = {
    getCurrentUser
};