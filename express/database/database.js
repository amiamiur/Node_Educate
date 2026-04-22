import {open, Database} from "sqlite";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";

let db;

export async function initDatabase() {
    db = await open({
        filename: "./data.db",
        driver: sqlite3.Database,
    })

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP CURRENT_TIMESTAMP
    )    
    `)
    return db;
}

export function getDatabase() {
    return db    
}