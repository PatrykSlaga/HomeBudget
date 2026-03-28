import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UnlockScreen from '../screens/UnlockScreen';
import MainTabs from './MainTabs';

export type RootStackParamList = {
    Unlock: undefined;
    MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isUnlocked ? (
                <Stack.Screen name="Unlock">
                    {() => <UnlockScreen onUnlock={() => setIsUnlocked(true)} />}
                </Stack.Screen>
            ) : (
                <Stack.Screen name="MainTabs" component={MainTabs} />
            )}
        </Stack.Navigator>
    );
}