import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, ScrollView } from 'react-native';

import { ExpenseService } from '../services/expenseService';
import { CategoryService } from '../services/categoryService';
import { BudgetService } from '../services/budgetService';

import { Expense } from '../models/Expense';
import { Category } from '../models/Category';
import { Budget } from '../models/Budget';

export default function DashboardScreen() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);

        const [e, c, b] = await Promise.all([
            ExpenseService.getAll(),
            CategoryService.getAll(),
            BudgetService.getAll(),
        ]);

        setExpenses(e);
        setCategories(c);
        setBudgets(b);

        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // 📊 statystyki
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // 📅 test miesiąca
    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthlySpent = expenses
        .filter(e => e.expenseDate.startsWith(currentMonth))
        .reduce((sum, e) => sum + e.amount, 0);

    // 🧪 TEST INSERT
    const addTestExpense = async () => {
        await ExpenseService.add({
            id: Date.now().toString(),
            userId: 'user1',
            categoryId: 'test',
            amount: 50,
            title: 'Test expense',
            note: 'Inserted from button',
            expenseDate: currentMonth,
            paymentMethod: 'cash',
            createdAt: new Date().toISOString(),
        });

        console.log('✅ INSERT DONE');

        await loadData();
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                📊 Dashboard
            </Text>

            {/* ===== STATS ===== */}
            <View style={{ marginTop: 20 }}>
                <Text>💸 Total spent: {totalSpent} zł</Text>
                <Text>📅 This month: {monthlySpent} zł</Text>
                <Text>🧾 Expenses: {expenses.length}</Text>
                <Text>🗂 Categories: {categories.length}</Text>
                <Text>📦 Budgets: {budgets.length}</Text>
            </View>

            {/* ===== TEST BUTTON ===== */}
            <View style={{ marginTop: 30 }}>
                <Button
                    title="➕ Add test expense"
                    onPress={addTestExpense}
                />
            </View>

            {/* ===== DEBUG ===== */}
            <View style={{ marginTop: 20 }}>
                <Button
                    title="🔄 Reload"
                    onPress={loadData}
                />

                <Button
                    title="🧪 Log data"
                    onPress={() => {
                        console.log('EXPENSES:', expenses);
                        console.log('CATEGORIES:', categories);
                        console.log('BUDGETS:', budgets);
                    }}
                />
            </View>
        </ScrollView>
    );
}