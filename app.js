require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("./src/config/session");

const authRoutes = require("./src/routes/authRoutes");
const bitrixRoutes = require("./src/routes/bitrixRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(session);

app.use("/auth", authRoutes);
app.use("/bitrix", bitrixRoutes);

module.exports = app;