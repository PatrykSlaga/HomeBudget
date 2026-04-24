import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('budget.db');

export const initDatabase = () => {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT,
      currency TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      userId TEXT,
      name TEXT,
      icon TEXT,
      color TEXT,
      type TEXT
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      userId TEXT,
      categoryId TEXT,
      amount REAL,
      title TEXT,
      note TEXT,
      expenseDate TEXT,
      paymentMethod TEXT,
      createdAt TEXT,
      FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      userId TEXT,
      month TEXT,
      plannedAmount REAL,
      warningThreshold REAL,
      createdAt TEXT
    );
  `);

  console.log('DB INIT OK');
};