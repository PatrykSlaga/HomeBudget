import { useEffect } from 'react';
import { initDatabase } from '../services/database';
import { CategoryService } from '../services/categoryService';

export const useAppInit = () => {
  useEffect(() => {
    const init = async () => {
      // 1. init DB
      initDatabase();
      console.log('🟢 DB INIT DONE');

      // 2. SEED categories jeśli brak
      const categories = await CategoryService.getAll();

      if (categories.length === 0) {
        CategoryService.add({
          id: 'test',
          userId: 'user1',
          name: 'Default category',
          icon: '💰',
          color: '#00ff00',
          type: 'expense',
        });

        console.log('🌱 DEFAULT CATEGORY CREATED');
      }
    };

    init();
  }, []);
};