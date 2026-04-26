import { db } from './database';
import { User } from '../models/User';

export type AuthResult =
    | { success: true; user: User }
    | { success: false; message: string };

type RegisterInput = {
    name: string;
    email: string;
    password: string;
    currency?: string;
};

const TEST_USER = {
    id: 'user1',
    name: 'Test User',
    email: 'test@homebudget.pl',
    password: 'test123',
    currency: 'PLN',
};

const normalizeEmail = (email: string) => {
    return email.toLowerCase().trim();
};

const createId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Na tym etapie jest to prosty hash developerski.
 * Do wersji produkcyjnej później można podmienić to np. na expo-crypto.
 */
const hashPassword = (password: string) => {
    let hash = 5381;

    for (let i = 0; i < password.length; i += 1) {
        hash = (hash * 33) ^ password.charCodeAt(i);
    }

    return `dev_${(hash >>> 0).toString(16)}`;
};

export const AuthService = {
    async seedTestUser() {
        const existing = db.getFirstSync<User>(
            'SELECT * FROM users WHERE email = ?',
            [TEST_USER.email]
        );

        if (existing) {
            return;
        }

        db.runSync(
            `INSERT INTO users
             (id, name, email, passwordHash, currency, createdAt)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                TEST_USER.id,
                TEST_USER.name,
                TEST_USER.email,
                hashPassword(TEST_USER.password),
                TEST_USER.currency,
                new Date().toISOString(),
            ]
        );

        console.log('TEST USER CREATED:', TEST_USER.email);
    },

    async register(input: RegisterInput): Promise<AuthResult> {
        const name = input.name.trim();
        const email = normalizeEmail(input.email);
        const password = input.password.trim();
        const currency = input.currency?.trim() || 'PLN';

        if (!name || !email || !password) {
            return {
                success: false,
                message: 'Uzupełnij wszystkie pola.',
            };
        }

        if (password.length < 4) {
            return {
                success: false,
                message: 'Hasło musi mieć minimum 4 znaki.',
            };
        }

        const existing = db.getFirstSync<User>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existing) {
            return {
                success: false,
                message: 'Użytkownik z takim e-mailem już istnieje.',
            };
        }

        const user: User = {
            id: createId(),
            name,
            email,
            passwordHash: hashPassword(password),
            currency,
            createdAt: new Date().toISOString(),
        };

        db.runSync(
            `INSERT INTO users
             (id, name, email, passwordHash, currency, createdAt)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user.id,
                user.name,
                user.email,
                user.passwordHash,
                user.currency,
                user.createdAt,
            ]
        );

        return {
            success: true,
            user,
        };
    },

    async login(emailInput: string, passwordInput: string): Promise<AuthResult> {
        const email = normalizeEmail(emailInput);
        const password = passwordInput.trim();

        if (!email || !password) {
            return {
                success: false,
                message: 'Podaj e-mail i hasło.',
            };
        }

        const user = db.getFirstSync<User>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            return {
                success: false,
                message: 'Nie znaleziono użytkownika.',
            };
        }

        if (user.passwordHash !== hashPassword(password)) {
            return {
                success: false,
                message: 'Nieprawidłowe hasło.',
            };
        }

        return {
            success: true,
            user,
        };
    },
};