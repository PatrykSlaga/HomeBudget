import { db } from './database';
import { User } from '../models/User';

export const UserService = {
  async get(): Promise<User | null> {
    return db.getFirstSync('SELECT * FROM user');
  },

  async save(u: User) {
    db.runSync(
        `INSERT OR REPLACE INTO user VALUES (?, ?, ?, ?)`,
        [u.id, u.name, u.currency, u.createdAt]
    );
  },
};