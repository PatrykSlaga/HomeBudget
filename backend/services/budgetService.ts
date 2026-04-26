import { db } from './database';
import { Budget } from '../models/Budget';

export const BudgetService = {
  async getAll(): Promise<Budget[]> {
    return db.getAllSync('SELECT * FROM budgets');
  },

  async set(b: Budget) {
    db.runSync(
        `INSERT OR REPLACE INTO budgets VALUES (?, ?, ?, ?, ?, ?)`,
        [b.id, b.userId, b.month, b.plannedAmount, b.warningThreshold, b.createdAt]
    );
  },
};