import Database from "better-sqlite3"

const db = new Database('./src/database/myDatabase.db', {
    fileMustExist: false,
});

console.log('Connected to myDatabase');

// db.exec('DROP TABLE IF EXISTS User');
// console.log('User table deleted');

db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

console.log('User table is ready');

export default db;