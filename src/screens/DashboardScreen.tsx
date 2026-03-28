import React from 'react';
import { Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

export default function DashboardScreen() {
    return (
        <ScreenContainer>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.text}>Tutaj będzie podsumowanie miesiąca.</Text>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        color: '#444',
    },
});