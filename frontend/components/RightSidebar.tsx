import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';

import { Category } from '../../backend/models/Category';
import { useUser } from '../hooks/useUser';

type RightSidebarProps = {
    visible: boolean;
    categories: Category[];
    onOpenCategory: (category: Category) => void;
    onClose: () => void;
};

const SIDEBAR_WIDTH = 130;
const FALLBACK_CATEGORY_COLOR = '#64748B';

const AVAILABLE_CURRENCIES = [
    { name: 'Polski Złoty', code: 'PLN', color: '#1E3A8A' },
    { name: 'Euro', code: 'EUR', color: '#0284C7' },
    { name: 'Dolar', code: 'USD' , color: '#16A34A'},
    { name: 'Yen japoński', code: 'JPY', color: '#DC2626' },
    { name: 'Korona Czeska', code: 'CZK', color: '#D97706' },
    { name: 'Won koreański', code: 'KRW', color: '#7C3AED' },
    { name: 'Forint węg.', code: 'HUF', color: '#059669' },
    { name: 'Frank Szwajc.', code: 'CHF', color: '#4B5563' }
];

export default function RightSidebar({
                                         visible,
                                         categories,
                                         onOpenCategory,
                                         onClose,
                                     }: RightSidebarProps) {
    // Pobieramy globalną metodę zmiany waluty z naszego nowego Contextu
    const { user, changeCurrency } = useUser();
    const [categoriesExpanded, setCategoriesExpanded] = useState(false);
    const [currencyExpanded, setCurrencyExpanded] = useState(false);

    const translateX = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: visible ? 0 : SIDEBAR_WIDTH,
            duration: 220,
            useNativeDriver: true,
        }).start();

        if (!visible) {
            setCategoriesExpanded(false);
            setCurrencyExpanded(false);
        }
    }, [visible, translateX]);

    const handleCurrencyChange = (currencyCode: string) => {
        if (!user) return;

        try {
            // Wywołujemy bezpieczną metodę z poziomu kontekstu
            changeCurrency(currencyCode);
            onClose();
        } catch (error) {
            Alert.alert('Błąd', 'Nie udało się zmienić waluty.');
        }
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.root}>
                <Pressable style={styles.overlay} onPress={onClose} />

                <Animated.View
                    style={[
                        styles.sidebar,
                        {
                            width: SIDEBAR_WIDTH,
                            transform: [{ translateX }],
                        },
                    ]}
                >
                    <ScrollView
                        style={styles.sidebarScroll}
                        contentContainerStyle={styles.sidebarContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* === SEKCJA: KATEGORIE === */}
                        <Pressable
                            style={styles.sectionButton}
                            onPress={() => setCategoriesExpanded(prev => !prev)}
                        >
                            <Text style={styles.sectionIcon}>▣</Text>
                            <Text style={styles.sectionLabel}>Kategorie</Text>
                            <Text style={styles.expandIcon}>
                                {categoriesExpanded ? '▲' : '▼'}
                            </Text>
                        </Pressable>

                        {categoriesExpanded ? (
                            <View style={styles.innerListContainer}>
                                {categories.map(category => {
                                    const categoryColor = category.color || FALLBACK_CATEGORY_COLOR;

                                    return (
                                        <Pressable
                                            key={category.id}
                                            style={[
                                                styles.categoryButton,
                                                { borderColor: categoryColor },
                                            ]}
                                            onPress={() => {
                                                onClose();
                                                onOpenCategory(category);
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    styles.categoryText,
                                                    { color: categoryColor },
                                                ]}
                                            >
                                                {category.name}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ) : null}

                        {/* === SEKCJA: WALUTY === */}
                        <Pressable
                            style={[styles.sectionButton, { marginTop: 24 }]}
                            onPress={() => setCurrencyExpanded(prev => !prev)}
                        >
                            <Text style={styles.currencyIcon}>↻</Text>
                            <Text style={styles.sectionLabel}>Waluty</Text>
                            <Text style={styles.expandIcon}>
                                {currencyExpanded ? '▲' : '▼'}
                            </Text>
                        </Pressable>

                        {currencyExpanded ? (
                            <View style={styles.innerListContainer}>
                                {AVAILABLE_CURRENCIES.map(curr => {
                                    // Sprawdzamy stan zsynchronizowany globalnie
                                    const isSelected = user?.currency === curr.code;

                                    return (
                                        <Pressable
                                            key={curr.code}
                                            style={[
                                                styles.currencyRow,
                                                { borderColor: curr.color },
                                                isSelected && styles.currencyRowSelected
                                            ]}
                                            onPress={() => handleCurrencyChange(curr.code)}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    styles.currencyText,
                                                    { color: curr.color },
                                                    isSelected && styles.currencyTextSelected
                                                ]}
                                            >
                                                {isSelected ? '✓ ' : ''}{curr.code}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ) : null}
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 35, 20, 0.35)',
    },
    sidebar: {
        height: '100%',
        backgroundColor: '#ffffff',
        borderLeftWidth: 1,
        borderLeftColor: '#7abf61',
    },
    sidebarScroll: {
        flex: 1,
    },
    sidebarContent: {
        paddingTop: 72,
        paddingBottom: 40,
        alignItems: 'center',
    },
    sectionButton: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 8,
    },
    sectionIcon: {
        fontSize: 44,
        lineHeight: 48,
        color: '#67b957',
        fontWeight: '700',
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#54aa3f',
        marginTop: 2,
    },
    expandIcon: {
        marginTop: 4,
        fontSize: 10,
        color: '#54aa3f',
        fontWeight: '800',
    },
    innerListContainer: {
        width: '100%',
        marginTop: 4,
    },
    categoryButton: {
        height: 28,
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '800',
    },
    currencyIcon: {
        fontSize: 44,
        lineHeight: 48,
        color: '#67b957',
        fontWeight: '800',
    },
    currencyRow: {
        height: 32,
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    currencyRowSelected: {
        backgroundColor: '#f0fdf4', // Lekko zielone tło dla wybranej waluty
    },
    currencyText: {
        fontSize: 11,
        fontWeight: '800',
    },
    currencyTextSelected: {
        fontWeight: '900',
    },
});