import Database from "better-sqlite3"

const db = new Database('./src/database/myDatabase.db', {
    fileMustExist: false,
});

console.log('Connected to myDatabase');

db.prepare(`
    CREATE TABLE IF NOT EXISTS User (
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`).run();

console.log('User table is ready');

export default db;