import { db } from './database';
import { User } from '../models/User';

export const UserService = {
    get(): User | null {
        return db.getFirstSync<User>('SELECT * FROM users LIMIT 1');
    },

    getById(id: string): User | null {
        return db.getFirstSync<User>(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
    },

    getByEmail(email: string): User | null {
        return db.getFirstSync<User>(
            'SELECT * FROM users WHERE email = ?',
            [email.toLowerCase().trim()]
        );
    },

    save(u: User) {
        db.runSync(
            `INSERT OR REPLACE INTO users
             (id, name, email, passwordHash, currency, createdAt)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                u.id,
                u.name,
                u.email,
                u.passwordHash,
                u.currency,
                u.createdAt,
            ]
        );
    },

    // === NOWA METODA, KTÓREJ BRAKOWAŁO ===
    updateCurrency(userId: string, currencyCode: string) {
        db.runSync(
            'UPDATE users SET currency = ? WHERE id = ?',
            [currencyCode.trim().toUpperCase(), userId]
        );
    }
};