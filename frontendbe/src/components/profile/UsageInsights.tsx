import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

export const UsageInsights = () => {
    const { colors, isDark } = useTheme();

    const usages = [
        { label: 'Verification', count: 65, total: 100, color: colors.primary },
        { label: 'Price Checks', count: 20, total: 100, color: '#4CAF50' },
        { label: 'Details', count: 15, total: 100, color: '#FF9800' },
    ];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0
            }
        ]}>
            <Text style={[styles.title, { color: colors.text }]}>Usage Insights</Text>

            {usages.map((item, index) => (
                <View key={index} style={styles.row}>
                    <View style={styles.labelRow}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>{item.label}</Text>
                        <Text style={[styles.value, { color: colors.text }]}>{item.count}%</Text>
                    </View>
                    <View style={[styles.track, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.bar,
                                { width: `${item.count}%`, backgroundColor: item.color }
                            ]}
                        />
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.m,
        borderRadius: 16,
        marginBottom: spacing.l,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    row: {
        marginBottom: spacing.m,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
    },
    value: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    track: {
        height: 6,
        borderRadius: 3,
        width: '100%',
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 3,
    },
});
