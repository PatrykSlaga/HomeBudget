import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import CategoryExpensesScreen from '../screens/CategoryExpensesScreen';
import { User } from '../../backend/models/User';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    CategoryExpenses: {
        categoryId: string;
        categoryName: string;
        categoryIcon: string;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type AuthScreen = 'login' | 'register';

export default function RootNavigator() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!currentUser ? (
                authScreen === 'login' ? (
                    <Stack.Screen name="Login">
                        {() => (
                            <LoginScreen
                                onLogin={setCurrentUser}
                                onGoToRegister={() => setAuthScreen('register')}
                            />
                        )}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="Register">
                        {() => (
                            <RegisterScreen
                                onRegister={setCurrentUser}
                                onGoToLogin={() => setAuthScreen('login')}
                            />
                        )}
                    </Stack.Screen>
                )
            ) : (
                <>
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                    <Stack.Screen
                        name="CategoryExpenses"
                        component={CategoryExpensesScreen}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}