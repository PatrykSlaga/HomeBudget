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

type LoginScreenProps = {
    onLogin: (user: User) => void;
    onGoToRegister: () => void;
};

export default function LoginScreen({ onLogin, onGoToRegister }: LoginScreenProps) {
    const [email, setEmail] = useState('test@homebudget.pl');
    const [password, setPassword] = useState('test123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        const result = await AuthService.login(email, password);

        setLoading(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        onLogin(result.user);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>HomeBudget</Text>
            <Text style={styles.title}>Logowanie</Text>
            <Text style={styles.subtitle}>
                Zaloguj się do lokalnego konta użytkownika.
            </Text>

            <View style={styles.form}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="np. test@homebudget.pl"
                />

                <Text style={styles.label}>Hasło</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="np. test123"
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Zaloguj</Text>
                    )}
                </Pressable>

                <Pressable onPress={onGoToRegister}>
                    <Text style={styles.link}>
                        Nie masz konta? Zarejestruj się
                    </Text>
                </Pressable>
            </View>

            <View style={styles.testBox}>
                <Text style={styles.testTitle}>Dane testowe</Text>
                <Text style={styles.testText}>E-mail: test@homebudget.pl</Text>
                <Text style={styles.testText}>Hasło: test123</Text>
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
    testBox: {
        marginTop: 18,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#eef2ff',
    },
    testTitle: {
        fontWeight: '700',
        marginBottom: 4,
    },
    testText: {
        color: '#334155',
    },
});