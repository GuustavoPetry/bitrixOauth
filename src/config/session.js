const session = require("express-session");

module.exports = session({
    secret: process.env.SESSION_SECRET || require("crypto").randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
});
