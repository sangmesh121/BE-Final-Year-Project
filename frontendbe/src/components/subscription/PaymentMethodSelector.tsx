import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

interface PaymentMethodSelectorProps {
    selectedMethod: string;
    onSelect: (method: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selectedMethod, onSelect }) => {
    const { colors, isDark } = useTheme();

    const methods = [
        { id: 'card', icon: 'credit-card', label: 'Credit Card' },
        { id: 'apple', icon: 'apple', label: 'Apple Pay' },
        { id: 'paypal', icon: 'paypal', label: 'PayPal' },
    ];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.textSecondary }]}>Payment Method</Text>
            <View style={styles.row}>
                {methods.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.option,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: isSelected ? colors.primary : colors.border,
                                    borderWidth: isSelected ? 2 : (isDark ? 1 : 1),
                                }
                            ]}
                            onPress={() => onSelect(method.id)}
                        >
                            <FontAwesome5
                                name={method.icon}
                                size={20}
                                color={isSelected ? colors.primary : colors.textSecondary}
                                style={{ marginBottom: 8 }}
                            />
                            <Text style={[
                                styles.label,
                                { color: isSelected ? colors.primary : colors.textSecondary }
                            ]}>
                                {method.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.l,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.m,
    },
    option: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
    },
});
