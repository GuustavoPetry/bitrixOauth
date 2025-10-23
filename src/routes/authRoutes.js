const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/start", authController.startAuth);
router.get("/callback", authController.handleCallback);
router.get("/refresh", authController.refreshToken);

module.exports = router;