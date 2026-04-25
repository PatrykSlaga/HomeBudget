import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import { useBudget } from '../hooks/useBudget';
import { useUser } from '../hooks/useUser';

export default function DashboardScreen() {
    const { expenses } = useExpenses();
    const { categories } = useCategories();
    const { budgets } = useBudget();
    const { user } = useUser();

    // 💰 total spent
    const totalSpent = useMemo(() => {
        return expenses.reduce((sum, e) => sum + e.amount, 0);
    }, [expenses]);

    // 📅 current month (YYYY-MM)
    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthlyExpenses = useMemo(() => {
        return expenses.filter(e => e.expenseDate.startsWith(currentMonth));
    }, [expenses, currentMonth]);

    const monthlySpent = useMemo(() => {
        return monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    }, [monthlyExpenses]);

    const currentBudget = useMemo(() => {
        return budgets.find(b => b.month === currentMonth);
    }, [budgets, currentMonth]);

    return (
        <View style={{ flex: 1, padding: 16, gap: 16 }}>

            {/* 👤 USER */}
            <View>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    Witaj {user?.name ?? 'Użytkowniku'}
                </Text>
                <Text>Waluta: {user?.currency ?? '-'}</Text>
            </View>

            {/* 💰 TOTAL */}
            <View>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                    Wszystkie wydatki
                </Text>
                <Text style={{ fontSize: 16 }}>{totalSpent.toFixed(2)}</Text>
            </View>

            {/* 📅 MONTHLY */}
            <View>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                    Ten miesiąc ({currentMonth})
                </Text>
                <Text style={{ fontSize: 16 }}>{monthlySpent.toFixed(2)}</Text>
            </View>

            {/* 🎯 BUDGET */}
            <View>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                    Budżet
                </Text>

                <Text>
                    Plan: {currentBudget?.plannedAmount ?? 0}
                </Text>

                <Text>
                    Wykorzystanie: {monthlySpent.toFixed(2)} / {currentBudget?.plannedAmount ?? 0}
                </Text>
            </View>

            {/* 🧾 RECENT EXPENSES */}
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
                    Ostatnie wydatki
                </Text>

                <FlatList
                    data={expenses.slice().reverse().slice(0, 10)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const category = categories.find(c => c.id === item.categoryId);

                        return (
                            <View
                                style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderColor: '#eee',
                                }}
                            >
                                <Text style={{ fontWeight: '600' }}>
                                    {item.title}
                                </Text>

                                <Text>
                                    {item.amount} • {category?.name ?? 'Brak kategorii'}
                                </Text>

                                <Text style={{ fontSize: 12, opacity: 0.6 }}>
                                    {item.expenseDate}
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
}