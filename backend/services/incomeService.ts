import { db } from './database';
import { Income } from '../models/Income';

export const IncomeService = {
    getAll(): Income[] {
        const rows = db.getAllSync<Income>(
            'SELECT * FROM incomes ORDER BY incomeDate DESC'
        );

        console.log('🔵 GET ALL INCOMES:', rows);

        return rows;
    },

    add(income: Income) {
        console.log('🟡 INSERT INCOME:', income);

        try {
            db.runSync(
                `INSERT INTO incomes
                (id, userId, amount, title, incomeDate, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    income.id,
                    income.userId,
                    income.amount,
                    income.title,
                    income.incomeDate,
                    income.createdAt,
                ]
            );

            console.log('🟢 INSERT INCOME OK');
        } catch (err) {
            console.log('🔴 INSERT INCOME ERROR:', err);
        }
    },

    update(income: Income) {
        db.runSync(
            `UPDATE incomes
            SET amount = ?, title = ?, incomeDate = ?
            WHERE id = ?`,
            [
                income.amount,
                income.title,
                income.incomeDate,
                income.id,
            ]
        );
    },

    delete(id: string) {
        db.runSync('DELETE FROM incomes WHERE id = ?', [id]);
    },
};