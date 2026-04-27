import React from 'react';

import DashboardScreen from '../screens/DashboardScreen';

export type MainTabParamList = {
    Dashboard: undefined;
};

export default function MainTabs() {
    return <DashboardScreen />;
}