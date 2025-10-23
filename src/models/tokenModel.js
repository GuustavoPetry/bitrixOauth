const db = require("../config/database");

exports.saveTokens = (tokens) => {
    const createdAt = Date.now();
    return new Promise((resolve, reject) => {
        db.run(
            `DELETE FROM tokens`, // Sempre mantém apenas um conjunto de tokens
            [],
            (err) => {
                if(err) return reject(err);
                db.run(
                    `INSERT INTO tokens (access_token, refresh_token, expires_in, created_at)
                    VALUES (?, ?, ?, ?)`,
                    [tokens.access_token, tokens.refresh_token, tokens.expires_in, createdAt],
                    (err2) => (err2 ? reject(err2) : resolve())
                );
            }
        );
    });
};

exports.getTokens = () => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM tokens LIMIT 1`, [], (err, row) => {
            if(err) reject(err);
            else resolve(row);
        });
    });
};  