export type CategoryType = 'expense' | 'income';

export type Category = {
    id: string;
    name: string;
    icon?: string;
    color?: string;
    type: CategoryType;
};