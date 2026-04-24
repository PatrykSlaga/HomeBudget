import { useEffect, useState } from 'react';
import { Category } from '../models/Category';
import { CategoryService } from '../services/categoryService';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    const load = async () => {
        setCategories(await CategoryService.getAll());
    };

    const add = async (c: Category) => {
        await CategoryService.add(c);
        await load();
    };

    const update = async (c: Category) => {
        await CategoryService.update(c);
        await load();
    };

    const remove = async (id: string) => {
        await CategoryService.delete(id);
        await load();
    };

    useEffect(() => {
        load();
    }, []);

    return { categories, add, update, remove };
};