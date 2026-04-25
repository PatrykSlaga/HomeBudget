import { ExpenseService } from '../services/expenseService';

test('add expense', async () => {
  const e = {
    id: '1',
    userId: 'u1',
    categoryId: 'c1',
    amount: 10,
    title: 'Test',
    expenseDate: '2026-04',
    paymentMethod: 'cash',
    createdAt: '2026',
  };

  await ExpenseService.add(e as any);

  const list = await ExpenseService.getAll();
  expect(list.length).toBeGreaterThan(0);
});