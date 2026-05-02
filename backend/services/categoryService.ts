import { db } from './database';
import { Category } from '../models/Category';

const DEFAULT_USER_ID = 'user1';

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_home',
    userId: DEFAULT_USER_ID,
    name: 'Dom',
    icon: '🏠',
    color: '#9fd27f',
    type: 'expense',
  },
  {
    id: 'cat_car',
    userId: DEFAULT_USER_ID,
    name: 'Samochód',
    icon: '🚗',
    color: '#8ccf67',
    type: 'expense',
  },
  {
    id: 'cat_transport',
    userId: DEFAULT_USER_ID,
    name: 'Transport',
    icon: '🚌',
    color: '#b2de97',
    type: 'expense',
  },
  {
    id: 'cat_clothes',
    userId: DEFAULT_USER_ID,
    name: 'Ubrania',
    icon: '👕',
    color: '#7fc85a',
    type: 'expense',
  },
  {
    id: 'cat_bills',
    userId: DEFAULT_USER_ID,
    name: 'Rachunki',
    icon: '💡',
    color: '#a4db87',
    type: 'expense',
  },
  {
    id: 'cat_pets',
    userId: DEFAULT_USER_ID,
    name: 'Zwierzęta',
    icon: '🐾',
    color: '#8fcf73',
    type: 'expense',
  },
  {
    id: 'cat_health',
    userId: DEFAULT_USER_ID,
    name: 'Zdrowie',
    icon: '💊',
    color: '#77c65a',
    type: 'expense',
  },
  {
    id: 'cat_food',
    userId: DEFAULT_USER_ID,
    name: 'Żywność',
    icon: '🍎',
    color: '#96d178',
    type: 'expense',
  },
  {
    id: 'cat_entertainment',
    userId: DEFAULT_USER_ID,
    name: 'Rozrywka',
    icon: '🎮',
    color: '#aadf8f',
    type: 'expense',
  },
];

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    return db.getAllSync<Category>('SELECT * FROM categories');
  },

  async add(c: Category) {
    db.runSync(
        `INSERT INTO categories 
             (id, userId, name, icon, color, type) 
             VALUES (?, ?, ?, ?, ?, ?)`,
        [c.id, c.userId, c.name, c.icon, c.color, c.type]
    );
  },

  async update(c: Category) {
    db.runSync(
        `UPDATE categories 
             SET name = ?, icon = ?, color = ?, type = ? 
             WHERE id = ?`,
        [c.name, c.icon, c.color, c.type, c.id]
    );
  },

  async delete(id: string) {
    db.runSync(
        `DELETE FROM categories WHERE id = ?`,
        [id]
    );
  },

  async seedDefaultCategories() {
    const existingCategories = await CategoryService.getAll();
    const existingIds = new Set(
        existingCategories.map(category => category.id)
    );

    for (const category of DEFAULT_CATEGORIES) {
      if (!existingIds.has(category.id)) {
        await CategoryService.add(category);
      }
    }

    console.log('🟢 DEFAULT CATEGORIES READY');
  },
};