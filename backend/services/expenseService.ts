import { db } from './database';
import { Expense } from '../models/Expense';

export const ExpenseService = {
    getAll(): Expense[] {
        const rows = db.getAllSync('SELECT * FROM expenses');

        console.log('🔵 GET ALL EXPENSES:', rows);

        return rows;
    },

    add(e: Expense) {
        console.log('🟡 INSERT EXPENSE:', e);

        try {
            db.runSync(
                `INSERT INTO expenses 
                (id, userId, categoryId, amount, title, note, expenseDate, paymentMethod, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    e.id,
                    e.userId,
                    e.categoryId,
                    e.amount,
                    e.title,
                    e.note ?? '',
                    e.expenseDate,
                    e.paymentMethod,
                    e.createdAt,
                ]
            );

            console.log('🟢 INSERT OK');
        } catch (err) {
            console.log('🔴 INSERT ERROR:', err);
        }
    },

    update(e: Expense) {
        db.runSync(
            `UPDATE expenses 
            SET categoryId=?, amount=?, title=?, note=?, expenseDate=?, paymentMethod=? 
            WHERE id=?`,
            [
                e.categoryId,
                e.amount,
                e.title,
                e.note ?? '',
                e.expenseDate,
                e.paymentMethod,
                e.id,
            ]
        );
    },

    delete(id: string) {
        db.runSync(`DELETE FROM expenses WHERE id=?`, [id]);
    },
};