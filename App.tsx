import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { useAppInit } from './frontend/hooks/useAppInit';
import RootNavigator from './frontend/navigation/RootNavigator';
import { store } from './frontend/store';

export default function App() {
    useAppInit();

    return (
        <Provider store={store}>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </Provider>
    );
}