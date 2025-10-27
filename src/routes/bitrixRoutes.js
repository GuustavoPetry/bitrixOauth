const express = require("express");
const router = express.Router();
const bitrixController = require("../controllers/bitrixController");
const webhookController = require("../controllers/webhookController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.get("/me", bitrixController.getUser);
router.post("/webhook", webhookController.receiveWebhookData);

module.exports = router;