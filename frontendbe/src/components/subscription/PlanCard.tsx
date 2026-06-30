import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

interface PlanCardProps {
    name: string;
    price: string;
    period: string;
    features: string[];
    isBestValue?: boolean;
    isSelected?: boolean;
    onSelect: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
    name, price, period, features, isBestValue, isSelected, onSelect
}) => {
    const { colors, isDark } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : (isDark ? 1 : 0),
                    // Add extra visual lift if selected
                    transform: isSelected ? [{ scale: 1.02 }] : []
                }
            ]}
            onPress={onSelect}
            activeOpacity={0.8}
        >
            {isBestValue && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>BEST VALUE</Text>
                </View>
            )}

            <Text style={[styles.name, { color: colors.textSecondary }]}>{name}</Text>

            <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
                <Text style={[styles.period, { color: colors.textSecondary }]}>/{period}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.features}>
                {features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                        <FontAwesome5 name="check" size={12} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                    </View>
                ))}
            </View>

            <View style={[
                styles.selectButton,
                { backgroundColor: isSelected ? colors.primary : colors.border }
            ]}>
                <Text style={[
                    styles.selectText,
                    { color: isSelected ? '#fff' : colors.textSecondary }
                ]}>
                    {isSelected ? 'Selected' : 'Select Plan'}
                </Text>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: spacing.l,
        borderRadius: 16,
        marginBottom: spacing.l,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginHorizontal: 4, // for shadow
    },
    badge: {
        position: 'absolute',
        top: -12,
        right: 20,
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 1,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: spacing.s,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: spacing.m,
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    period: {
        fontSize: 14,
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: spacing.m,
        width: '100%',
    },
    features: {
        marginBottom: spacing.l,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 14,
    },
    selectButton: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});
