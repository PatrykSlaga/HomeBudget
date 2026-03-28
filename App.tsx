import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store';

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </Provider>
    );
}