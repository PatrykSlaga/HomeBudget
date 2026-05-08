import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('budget.db');

const ensureColumnExists = (
    tableName: string,
    columnName: string,
    alterSql: string
) => {
  const columns = db.getAllSync<{ name: string }>(`PRAGMA table_info(${tableName})`);
  const columnExists = columns.some(column => column.name === columnName);

  if (!columnExists) {
    db.execSync(alterSql);
  }
};

export const initDatabase = () => {
  db.execSync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            passwordHash TEXT NOT NULL,
            currency TEXT NOT NULL,
            createdAt TEXT NOT NULL
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
            hiddenInCategory INTEGER DEFAULT 0,
            FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS incomes (
            id TEXT PRIMARY KEY,
            userId TEXT,
            amount REAL,
            title TEXT,
            incomeDate TEXT,
            createdAt TEXT
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

  ensureColumnExists(
      'expenses',
      'hiddenInCategory',
      'ALTER TABLE expenses ADD COLUMN hiddenInCategory INTEGER DEFAULT 0;'
  );

  console.log('DB INIT OK');
};