import {useAppInit} from "./src/hooks/useAppInit";
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
    useAppInit();

    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}