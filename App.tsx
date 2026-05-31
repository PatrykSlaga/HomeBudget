import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { useAppInit } from './frontend/hooks/useAppInit';
import RootNavigator from './frontend/navigation/RootNavigator';
import { store } from './frontend/store';
import { UserProvider } from './frontend/hooks/UserContext';

export default function App() {
    useAppInit();

    return (
        <Provider store={store}>
            <UserProvider> {/* <-- DODAJ OPAKOWANIE TUTAJ */}
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
            </UserProvider> {/* <-- ZAMKNIJ OPAKOWANIE TUTAJ */}
        </Provider>
    );
}