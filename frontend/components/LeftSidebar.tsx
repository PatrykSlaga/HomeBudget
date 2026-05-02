import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export type PeriodFilter = 'all' | 'day' | 'month';

type LeftSidebarProps = {
    visible: boolean;
    selectedPeriod: PeriodFilter;
    onSelectPeriod: (period: PeriodFilter) => void;
    onClose: () => void;
};

const SIDEBAR_WIDTH = 105;

const periodButtons: { key: PeriodFilter; label: string }[] = [
    { key: 'all', label: 'Wszystkie' },
    { key: 'day', label: 'Dzień' },
    { key: 'month', label: 'Miesiąc' },
];

export default function LeftSidebar({
                                        visible,
                                        selectedPeriod,
                                        onSelectPeriod,
                                        onClose,
                                    }: LeftSidebarProps) {
    const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: visible ? 0 : -SIDEBAR_WIDTH,
            duration: 220,
            useNativeDriver: true,
        }).start();
    }, [visible, translateX]);

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.root}>
                <Pressable style={styles.overlay} onPress={onClose} />

                <Animated.View
                    style={[
                        styles.sidebar,
                        {
                            width: SIDEBAR_WIDTH,
                            transform: [{ translateX }],
                        },
                    ]}
                >
                    <View style={styles.buttonsContainer}>
                        {periodButtons.map(button => {
                            const active = selectedPeriod === button.key;

                            return (
                                <Pressable
                                    key={button.key}
                                    style={[
                                        styles.filterButton,
                                        active && styles.filterButtonActive,
                                    ]}
                                    onPress={() => {
                                        onSelectPeriod(button.key);
                                        onClose();
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.filterButtonText,
                                            active && styles.filterButtonTextActive,
                                        ]}
                                    >
                                        {button.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(20, 35, 20, 0.35)',
    },
    sidebar: {
        height: '100%',
        backgroundColor: '#ffffff',
        paddingTop: 74,
        paddingHorizontal: 14,
        borderRightWidth: 1,
        borderRightColor: '#7abf61',
    },
    buttonsContainer: {
        gap: 22,
    },
    filterButton: {
        height: 52,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#69b34c',
        backgroundColor: '#f8fff4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#e8f6df',
    },
    filterButtonText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#63ad43',
    },
    filterButtonTextActive: {
        fontWeight: '700',
        color: '#4f9a36',
    },
});