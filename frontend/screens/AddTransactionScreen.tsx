import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/RootNavigator';
import { Category } from '../../backend/models/Category';
import { CategoryService } from '../../backend/services/categoryService';
import { ExpenseService } from '../../backend/services/expenseService';
import { IncomeService } from '../../backend/services/incomeService';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTransaction'>;

const DEFAULT_USER_ID = 'user1';
const FALLBACK_CATEGORY_COLOR = '#64748B';

function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}

function parseAmount(value: string) {
    const normalizedValue = value.trim().replace(',', '.');
    return Number(normalizedValue);
}

export default function AddTransactionScreen({ route, navigation }: Props) {
    const { mode } = route.params;

    const isIncomeMode = mode === 'income';

    const [title, setTitle] = useState('');
    const [amountText, setAmountText] = useState('');
    const [transactionDate, setTransactionDate] = useState(getTodayDate());
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            const loadedCategories = await CategoryService.getAll();

            setCategories(loadedCategories);

            if (loadedCategories.length > 0) {
                setSelectedCategoryId(loadedCategories[0].id);
            }
        };

        loadCategories();
    }, []);

    const selectedCategory = useMemo(() => {
        return categories.find(category => category.id === selectedCategoryId);
    }, [categories, selectedCategoryId]);

    const screenTitle = isIncomeMode ? 'Dodaj pieniądze' : 'Dodaj wydatek';
    const screenSubtitle = isIncomeMode ? 'Przyrost salda' : 'Zmniejszenie salda';
    const saveButtonLabel = isIncomeMode ? 'Zapisz wpływ' : 'Zapisz wydatek';

    const handleSave = () => {
        const amount = parseAmount(amountText);
        const trimmedTitle = title.trim();
        const trimmedDate = transactionDate.trim();

        if (!trimmedTitle) {
            Alert.alert('Brak tytułu', 'Wpisz tytuł transakcji.');
            return;
        }

        if (!amountText.trim() || Number.isNaN(amount) || amount <= 0) {
            Alert.alert('Niepoprawna kwota', 'Wpisz kwotę większą od zera.');
            return;
        }

        if (!trimmedDate) {
            Alert.alert('Brak daty', 'Wpisz datę transakcji.');
            return;
        }

        if (!isIncomeMode && !selectedCategoryId) {
            Alert.alert('Brak kategorii', 'Wybierz kategorię wydatku.');
            return;
        }

        const now = new Date().toISOString();
        const id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        if (isIncomeMode) {
            IncomeService.add({
                id,
                userId: DEFAULT_USER_ID,
                amount,
                title: trimmedTitle,
                incomeDate: trimmedDate,
                createdAt: now,
            });
        } else {
            ExpenseService.add({
                id,
                userId: DEFAULT_USER_ID,
                categoryId: selectedCategoryId as string,
                amount,
                title: trimmedTitle,
                note: '',
                expenseDate: trimmedDate,
                paymentMethod: 'cash',
                createdAt: now,
            });
        }

        navigation.goBack();
    };

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
                        <Text style={styles.headerTitle}>{screenTitle}</Text>
                        <Text style={styles.headerSubtitle}>{screenSubtitle}</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.modeBadge}>
                        <Text
                            style={[
                                styles.modeBadgeText,
                                isIncomeMode ? styles.incomeText : styles.expenseText,
                            ]}
                        >
                            {isIncomeMode ? '+ przyrost salda' : '− zmniejszenie salda'}
                        </Text>
                    </View>

                    <View style={styles.formCard}>
                        <Text style={styles.label}>Tytuł</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder={
                                isIncomeMode
                                    ? 'np. Pensja, pożyczka, premia'
                                    : 'np. Zakupy, paliwo, rachunek'
                            }
                            placeholderTextColor="#8da382"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Ilość pieniędzy</Text>
                        <TextInput
                            value={amountText}
                            onChangeText={setAmountText}
                            placeholder="np. 2500,00"
                            placeholderTextColor="#8da382"
                            keyboardType="decimal-pad"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Data</Text>
                        <TextInput
                            value={transactionDate}
                            onChangeText={setTransactionDate}
                            placeholder="RRRR-MM-DD"
                            placeholderTextColor="#8da382"
                            style={styles.input}
                        />

                        {!isIncomeMode ? (
                            <View style={styles.categorySection}>
                                <Text style={styles.label}>Kategoria wydatku</Text>

                                {categories.length === 0 ? (
                                    <Text style={styles.emptyCategoryText}>
                                        Brak kategorii do wyboru.
                                    </Text>
                                ) : (
                                    <View style={styles.categoryGrid}>
                                        {categories.map(category => {
                                            const selected = category.id === selectedCategoryId;
                                            const categoryColor = category.color || FALLBACK_CATEGORY_COLOR;

                                            return (
                                                <Pressable
                                                    key={category.id}
                                                    style={[
                                                        styles.categoryButton,
                                                        {
                                                            borderColor: categoryColor,
                                                            backgroundColor: selected ? categoryColor : '#ffffff',
                                                        },
                                                    ]}
                                                    onPress={() => setSelectedCategoryId(category.id)}
                                                >
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[
                                                            styles.categoryName,
                                                            { color: selected ? '#ffffff' : categoryColor },
                                                        ]}
                                                    >
                                                        {category.name}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                )}

                                {selectedCategory ? (
                                    <Text
                                        style={[
                                            styles.selectedCategoryText,
                                            { color: selectedCategory.color || FALLBACK_CATEGORY_COLOR },
                                        ]}
                                    >
                                        Wybrano: {selectedCategory.name}
                                    </Text>
                                ) : null}
                            </View>
                        ) : null}

                        <Pressable
                            style={[
                                styles.saveButton,
                                isIncomeMode ? styles.saveIncomeButton : styles.saveExpenseButton,
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>{saveButtonLabel}</Text>
                        </Pressable>
                    </View>
                </ScrollView>
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
        fontSize: 21,
        fontWeight: '800',
    },
    headerSubtitle: {
        color: '#eef8e8',
        fontSize: 13,
        marginTop: 2,
        fontWeight: '600',
    },
    scroll: {
        flex: 1,
    },
    content: {
        padding: 18,
        paddingBottom: 34,
    },
    modeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#9fd27f',
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginBottom: 14,
    },
    modeBadgeText: {
        fontSize: 14,
        fontWeight: '800',
    },
    incomeText: {
        color: '#5f8f2d',
    },
    expenseText: {
        color: '#ba120f',
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#9fd27f',
        padding: 16,
    },
    label: {
        color: '#4f9a36',
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 7,
        marginTop: 12,
    },
    input: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: '#9fd27f',
        borderRadius: 12,
        paddingHorizontal: 12,
        color: '#284620',
        backgroundColor: '#f7fbf4',
        fontSize: 15,
        fontWeight: '600',
    },
    categorySection: {
        marginTop: 4,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryButton: {
        width: '31%',
        minHeight: 58,
        borderRadius: 14,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        paddingVertical: 8,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '800',
        textAlign: 'center',
    },
    selectedCategoryText: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: '800',
    },
    emptyCategoryText: {
        color: '#ba120f',
        fontSize: 13,
        fontWeight: '700',
    },
    saveButton: {
        minHeight: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    saveIncomeButton: {
        backgroundColor: '#74bb4e',
    },
    saveExpenseButton: {
        backgroundColor: '#ba120f',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '900',
    },
});