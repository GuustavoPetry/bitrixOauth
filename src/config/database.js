const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../../database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            access_token TEXT,
            refresh_token TEXT,
            expires_in TEXT,
            created_at INTEGER
        )    
    `);
});

module.exports = db;