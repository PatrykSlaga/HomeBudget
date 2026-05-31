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
import { getCurrencyCode } from '../../backend/services/nbpService';

type RegisterScreenProps = {
    onRegister: (user: User) => void;
    onGoToLogin: () => void;
};

// Lista walut zadeklarowana zgodnie z Twoimi wymaganiami
const AVAILABLE_CURRENCIES = [
    { label: 'PLN', code: 'PLN' },
    { label: 'Euro', code: 'EUR' },
    { label: 'Dolar', code: 'USD' },
    { label: 'Yen', code: 'JPY' },
    { label: 'Korona Cz.', code: 'CZK' },
    { label: 'Won kor.', code: 'KRW' },
    { label: 'Forint', code: 'HUF' },
    { label: 'Frank Szw.', code: 'CHF' },
];

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

export default function RegisterScreen({
                                           onRegister,
                                           onGoToLogin,
                                       }: RegisterScreenProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currency, setCurrency] = useState('PLN'); // Przechowuje kod ISO, np. 'PLN', 'EUR'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (loading) {
            return;
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        // Przepuszczamy walutę przez nasz helper, aby upewnić się, że zapisze się czysty kod ISO (np. 'EUR')
        const validatedCurrency = getCurrencyCode(currency);

        if (!trimmedName || !trimmedEmail || !password) {
            setError('Uzupełnij wszystkie wymagane pola.');
            return;
        }

        if (password.length < 4) {
            setError('Hasło musi mieć minimum 4 znaki.');
            return;
        }

        setLoading(true);
        setError('');

        const result = await AuthService.register({
            name: trimmedName,
            email: trimmedEmail,
            password,
            currency: validatedCurrency,
        });

        setLoading(false);

        if (!result.success) {
            setError(result.message || 'Nie udało się utworzyć konta.');
            return;
        }

        onRegister(result.user);
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
                            <Text style={styles.screenTitle}>Sign Up</Text>

                            <Text style={styles.subtitle}>
                                Utwórz konto, aby rozpocząć zarządzanie swoim budżetem.
                            </Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Nazwa użytkownika</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    editable={!loading}
                                    placeholder="Wpisz nazwę"
                                    placeholderTextColor="#4e6b42"
                                    autoCapitalize="words"
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>E-mail</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    editable={!loading}
                                    placeholder="Wpisz e-mail"
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
                                    editable={!loading}
                                    placeholder="Minimum 4 znaki"
                                    placeholderTextColor="#4e6b42"
                                    secureTextEntry
                                    autoComplete="password-new"
                                    textContentType="newPassword"
                                    style={styles.input}
                                />
                            </View>

                            {/* Zmienione pole wyboru waluty na wygodny siatkowy Selector */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Domyślna waluta wprowadzania</Text>
                                <View style={styles.currencyGrid}>
                                    {AVAILABLE_CURRENCIES.map((item) => {
                                        const isSelected = currency === item.code;
                                        return (
                                            <Pressable
                                                key={item.code}
                                                disabled={loading}
                                                style={[
                                                    styles.currencyButton,
                                                    isSelected && styles.currencyButtonSelected,
                                                ]}
                                                onPress={() => setCurrency(item.code)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.currencyButtonText,
                                                        isSelected && styles.currencyButtonTextSelected,
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            {error ? <Text style={styles.error}>{error}</Text> : null}

                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    pressed && !loading && styles.buttonPressed,
                                    loading && styles.buttonDisabled,
                                ]}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                )}
                            </Pressable>

                            <Pressable onPress={onGoToLogin} style={styles.switchButton}>
                                <Text style={styles.switchText}>
                                    Masz konto?{' '}
                                    <Text style={styles.switchTextStrong}>Sign In</Text>
                                </Text>
                            </Pressable>
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
        justifyContent: 'flex-start',
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 32,
    },
    card: {
        width: '100%',
        backgroundColor: '#d7e2cf',
        borderRadius: 18,
        paddingHorizontal: 24,
        paddingVertical: 10,
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
        marginBottom: 28,
        lineHeight: 20,
    },
    formGroup: {
        width: '100%',
        marginBottom: 16,
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
    currencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        width: '100%',
        marginTop: 4,
    },
    currencyButton: {
        flexBasis: '23%', // Mieści około 4 przyciski w rzędzie
        flexGrow: 1,
        height: 44,
        backgroundColor: '#a3db7d',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    currencyButtonSelected: {
        backgroundColor: '#3f6927',
        borderColor: '#264a1f',
    },
    currencyButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#264a1f',
    },
    currencyButtonTextSelected: {
        color: '#ffffff',
        fontWeight: '700',
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
});