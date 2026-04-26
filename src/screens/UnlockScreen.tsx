import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type UnlockScreenProps = {
    onUnlock: () => void;
};

export default function UnlockScreen({ onUnlock }: UnlockScreenProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>HomeBudget</Text>
            <Text style={styles.subtitle}>Ekran startowy aplikacji</Text>

            <Pressable style={styles.button} onPress={onUnlock}>
                <Text style={styles.buttonText}>Odblokuj</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});