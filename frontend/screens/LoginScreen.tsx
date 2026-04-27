import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthService } from '../../backend/services/authService';
import { User } from '../../backend/models/User';

type LoginScreenProps = {
    onLogin: (user: User) => void;
    onGoToRegister: () => void;
};

function AppHeader() {
    return (
        <View style={styles.header}>
            <View style={styles.headerRow}>
                <View style={styles.menuIcon}>
                    <View style={styles.menuLine} />
                    <View style={styles.menuLine} />
                    <View style={styles.menuLine} />
                </View>

                <Text style={styles.headerTitle}>HomeBudget</Text>
            </View>
        </View>
    );
}

export default function LoginScreen({ onLogin, onGoToRegister }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (loading) {
            return;
        }

        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            setError('Uzupełnij login i hasło.');
            return;
        }

        setLoading(true);
        setError('');

        const result = await AuthService.login(trimmedEmail, password);

        setLoading(false);

        if (!result.success) {
            setError(result.message || 'Nie udało się zalogować.');
            return;
        }

        onLogin(result.user);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <AppHeader />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <View style={styles.content}>
                        <View style={styles.card}>
                            <Text style={styles.screenTitle}>Sign In</Text>

                            <Text style={styles.subtitle}>
                                Zaloguj się, aby przejść do panelu budżetu.
                            </Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Login</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Wpisz login"
                                    placeholderTextColor="#4e6b42"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Hasło</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Wpisz hasło"
                                    placeholderTextColor="#4e6b42"
                                    secureTextEntry
                                    autoComplete="password"
                                    textContentType="password"
                                    style={styles.input}
                                />
                            </View>

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    pressed && !loading && styles.buttonPressed,
                                    loading && styles.buttonDisabled,
                                ]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.buttonText}>Sign In</Text>
                                )}
                            </Pressable>

                            <Pressable onPress={onGoToRegister} style={styles.switchButton}>
                                <Text style={styles.switchText}>
                                    Nie masz konta? <Text style={styles.switchTextStrong}>Sign Up</Text>
                                </Text>
                            </Pressable>
                        </View>
                        <View style={styles.testBox}>
                            <Text style={styles.testTitle}>Dane testowe</Text>
                            <Text style={styles.testText}>Login: test@homebudget.pl</Text>
                            <Text style={styles.testText}>Hasło: test123</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        backgroundColor: '#74bb4e',
        height: 64,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        width: 26,
        marginRight: 8,
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    card: {
        width: '100%',
        backgroundColor: '#d7e2cf',
        borderRadius: 18,
        paddingHorizontal: 24,
        paddingVertical: 32,
        alignItems: 'center',
        shadowColor: '#35582b',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.16,
        shadowRadius: 10,
        elevation: 4,
    },
    screenTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#264a1f',
        marginBottom: 8,
    },
    subtitle: {
        width: '100%',
        fontSize: 14,
        color: '#35582b',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    formGroup: {
        width: '100%',
        marginBottom: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#264a1f',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 54,
        backgroundColor: '#93ce6d',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#35582b',
    },
    error: {
        width: '100%',
        color: '#b42318',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 2,
        marginBottom: 14,
    },
    button: {
        marginTop: 8,
        width: '100%',
        height: 48,
        backgroundColor: '#3f6927',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        opacity: 0.86,
        transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    switchButton: {
        marginTop: 20,
        paddingVertical: 6,
    },
    switchText: {
        fontSize: 14,
        color: '#35582b',
    },
    switchTextStrong: {
        fontWeight: '800',
        color: '#264a1f',
    },
    testBox: {
        marginTop: 28,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: '#c4d7b7',
        alignItems: 'center',
    },
    testTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#264a1f',
        marginBottom: 4,
    },
    testText: {
        fontSize: 12,
        color: '#35582b',
    },
});