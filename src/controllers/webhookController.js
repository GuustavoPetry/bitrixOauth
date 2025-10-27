const webhookService = require("../services/webhookService");

exports.receiveWebhookData = async (req, res) => {
    try {
        const data = Object.keys(req.query).length ? req.query : req.body;

        console.log("Método: ", req.method);
        console.log("Headers:", req.headers);
        console.log("Dados recebidos do Bitrix24: ", data);

        await webhookService.handleWebhook(data);

        res.status(200).send("Dados do Funil recebidos com sucesso");
    } catch(e) {
        console.error("Erro ao processar dados do Bitrix24", e.message);
        res.status(500).send("Erro interno ao processar dados");
    }
}