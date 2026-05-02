import { useEffect } from 'react';

import { initDatabase } from '../../backend/services/database';
import { AuthService } from '../../backend/services/authService';
import { CategoryService } from '../../backend/services/categoryService';

export const useAppInit = () => {
  useEffect(() => {
    const init = async () => {
      initDatabase();

      console.log('🟢 DB INIT DONE');

      await AuthService.seedTestUser();
      await CategoryService.seedDefaultCategories();
    };

    init();
  }, []);
};