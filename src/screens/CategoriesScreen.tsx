import React, { useState } from 'react';
import {
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    FlatList,
    View,
} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addCategory, removeCategory } from '../store/slices/categoriesSlice';

export default function CategoriesScreen() {
    const [categoryName, setCategoryName] = useState('');
    const categories = useAppSelector(state => state.categories.items);
    const dispatch = useAppDispatch();

    const handleAddCategory = () => {
        const trimmedName = categoryName.trim();

        if (!trimmedName) return;

        dispatch(addCategory(trimmedName));
        setCategoryName('');
    };

    return (
        <ScreenContainer>
            <Text style={styles.title}>Kategorie</Text>
            <Text style={styles.subtitle}>Dodawaj i usuwaj kategorie wydatków.</Text>

            <View style={styles.form}>
                <TextInput
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder="Nazwa kategorii"
                    style={styles.input}
                />

                <Pressable style={styles.addButton} onPress={handleAddCategory}>
                    <Text style={styles.addButtonText}>Dodaj</Text>
                </Pressable>
            </View>

            <FlatList
                data={categories}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.categoryItem}>
                        <Text style={styles.categoryName}>{item.name}</Text>

                        <Pressable
                            style={styles.deleteButton}
                            onPress={() => dispatch(removeCategory(item.id))}
                        >
                            <Text style={styles.deleteButtonText}>Usuń</Text>
                        </Pressable>
                    </View>
                )}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 20,
    },
    form: {
        gap: 12,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        gap: 12,
        paddingBottom: 20,
    },
    categoryItem: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 14,
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});