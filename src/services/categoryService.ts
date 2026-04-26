import { db } from './database';
import { Category } from '../models/Category';

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    return db.getAllSync('SELECT * FROM categories');
  },

  async add(c: Category) {
    db.runSync(
        `INSERT INTO categories VALUES (?, ?, ?, ?, ?, ?)`,
        [c.id, c.userId, c.name, c.icon, c.color, c.type]
    );
  },

  async update(c: Category) {
    db.runSync(
        `UPDATE categories SET name=?, icon=?, color=?, type=? WHERE id=?`,
        [c.name, c.icon, c.color, c.type, c.id]
    );
  },

  async delete(id: string) {
    db.runSync(`DELETE FROM categories WHERE id=?`, [id]);
  },
};