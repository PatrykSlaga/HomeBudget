import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import { useBudget } from '../hooks/useBudget';
import { useUser } from '../hooks/useUser';

export default function DashboardScreen() {
    const { expenses = [] } = useExpenses();
    const { categories = [] } = useCategories();
    const { budgets = [] } = useBudget();
    const { user } = useUser();

    // Dynamiczny sufix waluty pobierany prosto z profilu użytkownika (np. PLN, EUR)
    const currencySuffix = useMemo(() => {
        return user?.currency ? ` ${user.currency}` : ' zł';
    }, [user?.currency]);

    // Helper do szybkiego formatowania walutowego wewnątrz JSX
    const formatValue = (value: number) => {
        return `${value.toFixed(2).replace('.', ',')}${currencySuffix}`;
    };

    // 💰 Całkowity koszt (Suma wszystkich wydatków)
    const totalSpent = useMemo(() => {
        return expenses.reduce((sum, e) => sum + e.amount, 0);
    }, [expenses]);

    // 📅 Bieżący miesiąc pobierany systemowo (Format: YYYY-MM)
    const currentMonth = useMemo(() => {
        return new Date().toISOString().slice(0, 7);
    }, []);

    // Filtrowanie tablicy wydatków pod kątem obecnego okresu rozliczeniowego
    const monthlyExpenses = useMemo(() => {
        return expenses.filter(e => e.expenseDate && e.expenseDate.startsWith(currentMonth));
    }, [expenses, currentMonth]);

    const monthlySpent = useMemo(() => {
        return monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    }, [monthlyExpenses]);

    const currentBudget = useMemo(() => {
        return budgets.find(b => b.month === currentMonth);
    }, [budgets, currentMonth]);

    const plannedAmount = currentBudget?.plannedAmount ?? 0;

    return (
        <View style={styles.container}>

            {/* 👤 SEKCJA PROFILU */}
            <View style={styles.card}>
                <Text style={styles.welcomeText}>
                    Witaj, {user?.name ?? 'Użytkowniku'}
                </Text>
                <Text style={styles.subText}>Domyślna waluta: {user?.currency ?? 'PLN'}</Text>
            </View>

            {/* 💰 SUMARYCZNE STATYSTYKI */}
            <View style={styles.row}>
                <View style={[styles.card, { flex: 1 }]}>
                    <Text style={styles.label}>Wszystkie wydatki</Text>
                    <Text style={styles.valueAccent}>{formatValue(totalSpent)}</Text>
                </View>

                <View style={[styles.card, { flex: 1 }]}>
                    <Text style={styles.label}>Miesiąc ({currentMonth})</Text>
                    <Text style={styles.value}>{formatValue(monthlySpent)}</Text>
                </View>
            </View>

            {/* 🎯 KONTROLA BUDŻETU */}
            <View style={styles.card}>
                <Text style={styles.label}>Kontrola limitu budżetowego</Text>
                <Text style={styles.subText}>
                    Zaplanowano: {formatValue(plannedAmount)}
                </Text>
                <Text style={[
                    styles.usageText,
                    monthlySpent > plannedAmount ? styles.overBudget : styles.underBudget
                ]}>
                    Wykorzystanie: {formatValue(monthlySpent)} / {formatValue(plannedAmount)}
                </Text>
            </View>

            {/* 🧾 OSTATNIE TRANSAKCJE */}
            <View style={[styles.card, { flex: 1, paddingBottom: 0 }]}>
                <Text style={[styles.label, { marginBottom: 12 }]}>
                    Ostatnie wydatki
                </Text>

                <FlatList
                    data={expenses.slice().reverse().slice(0, 10)}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const category = categories.find(c => c.id === item.categoryId);

                        return (
                            <View style={styles.itemRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.itemSub}>
                                        {category?.name ?? 'Brak kategorii'} • {item.expenseDate}
                                    </Text>
                                </View>
                                <Text style={styles.itemAmount}>
                                    {formatValue(item.amount)}
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f6f8',
        gap: 12,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 4,
    },
    subText: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    valueAccent: {
        fontSize: 18,
        fontWeight: '700',
        color: '#b91c1c',
    },
    usageText: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 6,
    },
    underBudget: {
        color: '#16a34a',
    },
    overBudget: {
        color: '#dc2626',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#f1f5f9',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    itemSub: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
    },
    itemAmount: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
    },
});