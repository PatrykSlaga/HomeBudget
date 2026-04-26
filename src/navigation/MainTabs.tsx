import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import BudgetScreen from '../screens/BudgetScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';

export type MainTabParamList = {
    Dashboard: undefined;
    Expenses: undefined;
    Budget: undefined;
    Categories: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Pulpit' }} />
            <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Wydatki' }} />
            <Tab.Screen name="Budget" component={BudgetScreen} options={{ title: 'Budżet' }} />
            <Tab.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Kategorie' }} />
            <Tab.Screen name="Profile" component={ProfileSettingsScreen} options={{ title: 'Profil' }} />
        </Tab.Navigator>
    );
}