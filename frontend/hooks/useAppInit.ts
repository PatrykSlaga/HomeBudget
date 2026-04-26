import { useEffect } from 'react';

import { initDatabase } from '../../backend/services/database';
import { CategoryService } from '../../backend/services/categoryService';
import { AuthService } from '../../backend/services/authService';

export const useAppInit = () => {
  useEffect(() => {
    const init = async () => {
      initDatabase();
      console.log('🟢 DB INIT DONE');

      await AuthService.seedTestUser();

      const categories = await CategoryService.getAll();

      if (categories.length === 0) {
        await CategoryService.add({
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