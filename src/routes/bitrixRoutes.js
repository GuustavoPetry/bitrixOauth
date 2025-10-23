const express = require("express");
const router = express.Router();
const bitrixController = require("../controllers/bitrixController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.get("/me", bitrixController.getUser);

module.exports = router;