import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Category } from '../../backend/models/Category';

type RightSidebarProps = {
    visible: boolean;
    categories: Category[];
    onOpenCategory: (category: Category) => void;
    onClose: () => void;
};

const SIDEBAR_WIDTH = 118;

export default function RightSidebar({
                                         visible,
                                         categories,
                                         onOpenCategory,
                                         onClose,
                                     }: RightSidebarProps) {
    const [categoriesExpanded, setCategoriesExpanded] = useState(false);

    const translateX = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: visible ? 0 : SIDEBAR_WIDTH,
            duration: 220,
            useNativeDriver: true,
        }).start();

        if (!visible) {
            setCategoriesExpanded(false);
        }
    }, [visible, translateX]);

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
                    <Pressable
                        style={styles.sectionButton}
                        onPress={() => setCategoriesExpanded(prev => !prev)}
                    >
                        <Text style={styles.categoryIcon}>▣</Text>

                        <Text style={styles.sectionLabel}>
                            Kategorie
                        </Text>

                        <Text style={styles.expandIcon}>
                            {categoriesExpanded ? '▲' : '▼'}
                        </Text>
                    </Pressable>

                    {categoriesExpanded ? (
                        <ScrollView
                            style={styles.categoryList}
                            showsVerticalScrollIndicator={false}
                        >
                            {categories.map(category => (
                                <Pressable
                                    key={category.id}
                                    style={styles.categoryButton}
                                    onPress={() => {
                                        onClose();
                                        onOpenCategory(category);
                                    }}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={styles.categoryText}
                                    >
                                        {category.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    ) : null}

                    <View style={styles.currencyBox}>
                        <Text style={styles.currencyIcon}>↻</Text>
                        <Text style={styles.sectionLabel}>Waluty</Text>
                    </View>
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
        paddingTop: 72,
        borderLeftWidth: 1,
        borderLeftColor: '#7abf61',
        alignItems: 'center',
    },
    sectionButton: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 8,
    },
    categoryIcon: {
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
    categoryList: {
        width: '100%',
        maxHeight: 260,
        marginTop: 4,
    },
    categoryButton: {
        height: 25,
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#7abf61',
        backgroundColor: '#eef8e8',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    categoryText: {
        fontSize: 11,
        color: '#4fa83b',
        fontWeight: '500',
    },
    currencyBox: {
        marginTop: 16,
        alignItems: 'center',
    },
    currencyIcon: {
        fontSize: 48,
        lineHeight: 52,
        color: '#67b957',
        fontWeight: '800',
    },
});