export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  title: string;
  note?: string;
  expenseDate: string;
  paymentMethod: string;
  createdAt: string;
}