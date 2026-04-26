import { db } from './database';
import { User } from '../models/User';

export const UserService = {
  async get(): Promise<User | null> {
    return db.getFirstSync<User>('SELECT * FROM users LIMIT 1');
  },

  async getById(id: string): Promise<User | null> {
    return db.getFirstSync<User>(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
  },

  async getByEmail(email: string): Promise<User | null> {
    return db.getFirstSync<User>(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase().trim()]
    );
  },

  async save(u: User) {
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
};