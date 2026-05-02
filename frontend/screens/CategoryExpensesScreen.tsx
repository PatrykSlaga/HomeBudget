import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { Expense } from '../../backend/models/Expense';
import { ExpenseService } from '../../backend/services/expenseService';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryExpenses'>;

function formatCurrency(value: number) {
    return `${value.toFixed(2).replace('.', ',')} zł`;
}

function formatDate(date: string) {
    return date.slice(0, 10);
}

export default function CategoryExpensesScreen({ route, navigation }: Props) {
    const { categoryId, categoryName, categoryIcon } = route.params;

    const [expenses, setExpenses] = useState<Expense[]>([]);

    const loadExpenses = () => {
        const data = ExpenseService.getByCategoryId(categoryId);
        setExpenses(data);
    };

    useEffect(() => {
        loadExpenses();
    }, [categoryId]);

    const total = useMemo(() => {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }, [expenses]);

    const average = useMemo(() => {
        if (expenses.length === 0) {
            return 0;
        }

        return total / expenses.length;
    }, [expenses, total]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>‹</Text>
                    </Pressable>

                    <View style={styles.headerTitleBox}>
                        <Text style={styles.headerTitle}>
                            {categoryIcon} {categoryName}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Wydatki kategorii
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryBox}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Suma</Text>
                        <Text style={styles.summaryValue}>
                            {formatCurrency(total)}
                        </Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Liczba</Text>
                        <Text style={styles.summaryValue}>
                            {expenses.length}
                        </Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Średnio</Text>
                        <Text style={styles.summaryValue}>
                            {formatCurrency(average)}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Lista wydatków</Text>

                <FlatList
                    data={expenses}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyTitle}>
                                Brak wydatków
                            </Text>
                            <Text style={styles.emptyText}>
                                W tej kategorii nie ma jeszcze zapisanych wydatków.
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.expenseCard}>
                            <View style={styles.expenseHeader}>
                                <Text style={styles.expenseTitle}>
                                    {item.title}
                                </Text>

                                <Text style={styles.expenseAmount}>
                                    {formatCurrency(item.amount)}
                                </Text>
                            </View>

                            <Text style={styles.expenseDate}>
                                Data: {formatDate(item.expenseDate)}
                            </Text>

                            <Text style={styles.expensePayment}>
                                Metoda płatności: {item.paymentMethod}
                            </Text>

                            {item.note ? (
                                <Text style={styles.expenseNote}>
                                    Notatka: {item.note}
                                </Text>
                            ) : null}
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#74bb4e',
    },
    container: {
        flex: 1,
        backgroundColor: '#d7e2cf',
    },
    header: {
        height: 72,
        backgroundColor: '#74bb4e',
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 38,
        lineHeight: 40,
        marginTop: -2,
    },
    headerTitleBox: {
        flex: 1,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
    },
    headerSubtitle: {
        color: '#eef8e8',
        fontSize: 12,
        marginTop: 2,
    },
    summaryBox: {
        margin: 16,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#9fd27f',
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#5f8f2d',
        marginBottom: 5,
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '800',
        color: '#3f7f2e',
    },
    sectionTitle: {
        marginHorizontal: 16,
        marginBottom: 10,
        fontSize: 17,
        fontWeight: '800',
        color: '#4f9a36',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    expenseCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#9fd27f',
        padding: 14,
        marginBottom: 10,
    },
    expenseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 6,
    },
    expenseTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '800',
        color: '#2f7f25',
    },
    expenseAmount: {
        fontSize: 15,
        fontWeight: '800',
        color: '#ba120f',
    },
    expenseDate: {
        fontSize: 12,
        color: '#5f8f2d',
        marginBottom: 3,
    },
    expensePayment: {
        fontSize: 12,
        color: '#5f8f2d',
        marginBottom: 3,
    },
    expenseNote: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    emptyBox: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#9fd27f',
        padding: 18,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#4f9a36',
        marginBottom: 5,
    },
    emptyText: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
    },
});