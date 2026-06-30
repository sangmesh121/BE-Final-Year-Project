import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

interface StatItemProps {
    label: string;
    value: string | number;
    color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, color }) => {
    const { colors } = useTheme();
    return (
        <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: color || colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
    );
};

export const AccountOverview = () => {
    const { colors, isDark } = useTheme();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0
            }
        ]}>
            <Text style={[styles.title, { color: colors.text }]}>Account Overview</Text>
            <View style={styles.statsRow}>
                <StatItem label="Total Scans" value="142" color={colors.primary} />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <StatItem label="Verified" value="98" color="#4CAF50" />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <StatItem label="Price Checks" value="35" color="#FF9800" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.m,
        borderRadius: 16,
        marginBottom: spacing.l,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
    },
    divider: {
        width: 1,
        height: 30,
    },
});
