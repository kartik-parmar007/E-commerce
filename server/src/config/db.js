// src/db/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from "dotenv";

dotenv.config();

// Initialize SQLite database
let db;

const initializeDb = async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  
  console.log("✅ SQLite connected successfully");
  
  // Enable foreign keys for SQLite
  await db.exec('PRAGMA foreign_keys = ON');
  
  return db;
};

// Initialize the database connection
const getDb = async () => {
  if (!db) {
    db = await initializeDb();
  }
  return db;
};

// Test connection
try {
  await getDb();
} catch (err) {
  console.error("❌ SQLite connection error:", err);
}

export default {
  query: async (sql, params = []) => {
    const db = await getDb();
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return { rows: await db.all(sql, params) };
    } else {
      const result = await db.run(sql, params);
      return { 
        rows: result.lastID ? [{ id: result.lastID }] : [],
        rowCount: result.changes
      };
    }
  },
  getDb
};