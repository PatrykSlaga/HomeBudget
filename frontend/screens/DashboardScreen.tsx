import React, { useEffect, useMemo, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LeftSidebar, { PeriodFilter } from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

import type { RootStackParamList } from '../navigation/RootNavigator';
import { Category } from '../../backend/models/Category';
import { Expense } from '../../backend/models/Expense';
import { CategoryService } from '../../backend/services/categoryService';
import { ExpenseService } from '../../backend/services/expenseService';

type ExpenseCategory = {
    id: string;
    name: string;
    amount: number;
    color: string;
};

const INCOME_TOTAL = 1583.0;

function formatCurrency(value: number) {
    return `${value.toFixed(2).replace('.', ',')}zł`;
}

type AppHeaderProps = {
    onOpenLeftSidebar: () => void;
    onOpenRightSidebar: () => void;
};

function AppHeader({
                       onOpenLeftSidebar,
                       onOpenRightSidebar,
                   }: AppHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Pressable
                    style={styles.menuButton}
                    onPress={onOpenLeftSidebar}
                >
                    <View style={styles.menuLine} />
                    <View style={styles.menuLine} />
                    <View style={styles.menuLine} />
                </Pressable>

                <Text style={styles.headerTitle}>HomeBudget</Text>
            </View>

            <View style={styles.headerRight}>
                <Pressable style={styles.headerIcon}>
                    <View style={styles.searchCircle} />
                    <View style={styles.searchHandle} />
                </Pressable>

                <Pressable style={styles.switchIcon}>
                    <View style={styles.switchTrack}>
                        <View style={styles.switchThumb} />
                    </View>
                </Pressable>

                <Pressable
                    style={styles.moreButton}
                    onPress={onOpenRightSidebar}
                >
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                    <View style={styles.moreDot} />
                </Pressable>
            </View>
        </View>
    );
}

function DecorBars() {
    return (
        <View style={styles.decorBars}>
            <View style={styles.decorBar} />
            <View style={styles.decorBar} />
            <View style={styles.decorBar} />
        </View>
    );
}

type DonutChartProps = {
    incomeTotal: number;
    expenseTotal: number;
    categories: ExpenseCategory[];
};

function DonutChart({
                        incomeTotal,
                        expenseTotal,
                        categories,
                    }: DonutChartProps) {
    const size = 230;
    const strokeWidth = 48;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = categories.reduce((sum, item) => sum + item.amount, 0);

    let accumulatedFraction = 0;

    return (
        <View style={styles.chartWrapper}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#b9e0a4"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    {categories.map((category, index) => {
                        const fraction = total === 0 ? 0 : category.amount / total;
                        const dashLength = circumference * fraction;
                        const gapLength = circumference - dashLength;
                        const dashOffset = -circumference * accumulatedFraction;

                        accumulatedFraction += fraction;

                        return (
                            <Circle
                                key={`${category.id}-${index}`}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={category.color}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={`${dashLength} ${gapLength}`}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="butt"
                            />
                        );
                    })}
                </G>
            </Svg>

            <View style={styles.chartCenter}>
                <Text style={styles.chartIncome}>
                    {formatCurrency(incomeTotal)}
                </Text>

                <Text style={styles.chartExpense}>
                    {formatCurrency(expenseTotal)}
                </Text>
            </View>
        </View>
    );
}

export default function DashboardScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [categories, setCategories] = useState<Category[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
    const [rightSidebarVisible, setRightSidebarVisible] = useState(false);

    const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('all');

    const loadDashboardData = async () => {
        const loadedCategories = await CategoryService.getAll();
        const loadedExpenses = ExpenseService.getAll();

        setCategories(loadedCategories);
        setExpenses(loadedExpenses);
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = new Date().toISOString().slice(0, 7);

    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            if (selectedPeriod === 'all') {
                return true;
            }

            if (selectedPeriod === 'day') {
                return expense.expenseDate.startsWith(today);
            }

            return expense.expenseDate.startsWith(currentMonth);
        });
    }, [expenses, selectedPeriod, today, currentMonth]);

    const chartCategories = useMemo<ExpenseCategory[]>(() => {
        return categories.map(category => {
            const amount = filteredExpenses
                .filter(expense => expense.categoryId === category.id)
                .reduce((sum, expense) => sum + expense.amount, 0);

            return {
                id: category.id,
                name: category.name,
                amount,
                color: category.color || '#9fd27f',
            };
        });
    }, [categories, filteredExpenses]);

    const expenseTotal = useMemo(() => {
        return filteredExpenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
        );
    }, [filteredExpenses]);

    const balance = INCOME_TOTAL - expenseTotal;

    const openCategoryScreen = (category: Category) => {
        navigation.navigate('CategoryExpenses', {
            categoryId: category.id,
            categoryName: category.name,
            categoryIcon: category.icon,
        });
    };

    const addDemoExpense = async () => {
        if (categories.length === 0) {
            console.log('Brak kategorii — nie można dodać wydatku testowego.');
            return;
        }

        const randomCategory =
            categories[Math.floor(Math.random() * categories.length)];

        const amount = Math.floor(Math.random() * 120) + 30;

        ExpenseService.add({
            id: Date.now().toString(),
            userId: 'user1',
            categoryId: randomCategory.id,
            amount,
            title: `Wydatek testowy - ${randomCategory.name}`,
            note: 'Dodany z przycisku plus',
            expenseDate: new Date().toISOString(),
            paymentMethod: 'cash',
            createdAt: new Date().toISOString(),
        });

        await loadDashboardData();
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <AppHeader
                    onOpenLeftSidebar={() => setLeftSidebarVisible(true)}
                    onOpenRightSidebar={() => setRightSidebarVisible(true)}
                />

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <DonutChart
                        incomeTotal={INCOME_TOTAL}
                        expenseTotal={expenseTotal}
                        categories={chartCategories}
                    />

                    <View style={styles.balanceRow}>
                        <DecorBars />

                        <View style={styles.balanceBox}>
                            <Text style={styles.balanceText}>
                                SALDO {formatCurrency(balance)}
                            </Text>
                        </View>

                        <DecorBars />
                    </View>

                    <View style={styles.actionRow}>
                        <Pressable style={styles.minusButton}>
                            <Text style={styles.minusText}>−</Text>
                        </Pressable>

                        <Pressable
                            style={styles.plusButton}
                            onPress={addDemoExpense}
                        >
                            <Text style={styles.plusText}>+</Text>
                        </Pressable>
                    </View>
                </ScrollView>

                <LeftSidebar
                    visible={leftSidebarVisible}
                    selectedPeriod={selectedPeriod}
                    onSelectPeriod={setSelectedPeriod}
                    onClose={() => setLeftSidebarVisible(false)}
                />

                <RightSidebar
                    visible={rightSidebarVisible}
                    categories={categories}
                    onOpenCategory={openCategoryScreen}
                    onClose={() => setRightSidebarVisible(false)}
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
        height: 64,
        backgroundColor: '#74bb4e',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        width: 28,
        marginRight: 8,
        justifyContent: 'center',
    },
    menuLine: {
        height: 3,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        marginVertical: 2,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        width: 30,
        height: 30,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchCircle: {
        width: 15,
        height: 15,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    searchHandle: {
        width: 8,
        height: 2,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        transform: [{ rotate: '45deg' }],
        marginTop: -1,
        marginLeft: 13,
    },
    switchIcon: {
        width: 38,
        height: 30,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchTrack: {
        width: 30,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    switchThumb: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#74bb4e',
        alignSelf: 'flex-end',
    },
    moreButton: {
        width: 24,
        height: 30,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        marginVertical: 2,
    },
    scroll: {
        flex: 1,
    },
    content: {
        alignItems: 'center',
        paddingTop: 66,
        paddingHorizontal: 20,
        paddingBottom: 34,
    },
    chartWrapper: {
        width: 230,
        height: 230,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70,
    },
    chartCenter: {
        position: 'absolute',
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartIncome: {
        fontSize: 16,
        color: '#5f8f2d',
        marginBottom: 6,
    },
    chartExpense: {
        fontSize: 16,
        color: '#ba120f',
    },
    balanceRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 52,
    },
    decorBars: {
        width: 38,
        marginHorizontal: 10,
    },
    decorBar: {
        height: 4,
        backgroundColor: '#8bcf63',
        marginVertical: 3,
    },
    balanceBox: {
        backgroundColor: '#8fce68',
        minWidth: 150,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 14,
    },
    balanceText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 18,
    },
    actionRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 4,
    },
    minusButton: {
        width: 92,
        height: 92,
        borderRadius: 46,
        borderWidth: 4,
        borderColor: '#b80f0f',
        backgroundColor: '#f7f7f7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusButton: {
        width: 92,
        height: 92,
        borderRadius: 46,
        borderWidth: 4,
        borderColor: '#5d9f43',
        backgroundColor: '#f7f7f7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    minusText: {
        fontSize: 34,
        fontWeight: '700',
        color: '#b80f0f',
        marginTop: -2,
    },
    plusText: {
        fontSize: 34,
        fontWeight: '700',
        color: '#5d9f43',
        marginTop: -2,
    },
});