import { db } from './database';
import { Expense } from '../models/Expense';

type GetByCategoryOptions = {
    includeHidden?: boolean;
};

export const ExpenseService = {
    getAll(): Expense[] {
        const rows = db.getAllSync<Expense>('SELECT * FROM expenses');

        console.log('🔵 GET ALL EXPENSES:', rows);

        return rows;
    },

    getByCategoryId(
        categoryId: string,
        options: GetByCategoryOptions = {}
    ): Expense[] {
        const includeHidden = options.includeHidden ?? false;

        const rows = includeHidden
            ? db.getAllSync<Expense>(
                `SELECT * FROM expenses
                 WHERE categoryId = ?
                 ORDER BY expenseDate DESC`,
                [categoryId]
            )
            : db.getAllSync<Expense>(
                `SELECT * FROM expenses
                 WHERE categoryId = ?
                 AND COALESCE(hiddenInCategory, 0) = 0
                 ORDER BY expenseDate DESC`,
                [categoryId]
            );

        console.log('🔵 GET EXPENSES BY CATEGORY:', categoryId, rows);

        return rows;
    },

    add(e: Expense) {
        console.log('🟡 INSERT EXPENSE:', e);

        try {
            db.runSync(
                `INSERT INTO expenses
                 (id, userId, categoryId, amount, title, note, expenseDate, paymentMethod, createdAt, hiddenInCategory)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    e.hiddenInCategory ?? 0,
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

    hideFromCategoryList(id: string) {
        db.runSync(
            `UPDATE expenses
             SET hiddenInCategory = 1
             WHERE id = ?`,
            [id]
        );
    },

    delete(id: string) {
        db.runSync(`DELETE FROM expenses WHERE id=?`, [id]);
    },
};