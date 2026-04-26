import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { AuthService } from '../../backend/services/authService';
import { User } from '../../backend/models/User';

type RegisterScreenProps = {
    onRegister: (user: User) => void;
    onGoToLogin: () => void;
};

export default function RegisterScreen({ onRegister, onGoToLogin }: RegisterScreenProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currency, setCurrency] = useState('PLN');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setError('');

        const result = await AuthService.register({
            name,
            email,
            password,
            currency,
        });

        setLoading(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        onRegister(result.user);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>HomeBudget</Text>
            <Text style={styles.title}>Rejestracja</Text>
            <Text style={styles.subtitle}>
                Utwórz lokalne konto do zarządzania budżetem.
            </Text>

            <View style={styles.form}>
                <Text style={styles.label}>Nazwa użytkownika</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="np. Bartek"
                />

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="np. bartek@mail.com"
                />

                <Text style={styles.label}>Hasło</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="minimum 4 znaki"
                />

                <Text style={styles.label}>Waluta</Text>
                <TextInput
                    style={styles.input}
                    value={currency}
                    onChangeText={setCurrency}
                    autoCapitalize="characters"
                    placeholder="PLN"
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Zarejestruj</Text>
                    )}
                </Pressable>

                <Pressable onPress={onGoToLogin}>
                    <Text style={styles.link}>
                        Masz już konto? Wróć do logowania
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#f8fafc',
    },
    logo: {
        fontSize: 34,
        fontWeight: '800',
        color: '#4f46e5',
        textAlign: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 28,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#4f46e5',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    link: {
        textAlign: 'center',
        marginTop: 16,
        color: '#4f46e5',
        fontWeight: '600',
    },
    error: {
        color: '#dc2626',
        marginBottom: 10,
        fontWeight: '600',
    },
});