import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { Button } from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';

export const SubscriptionCard = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<any>();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0
            }
        ]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Current Plan</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Premium</Text>
                </View>
            </View>

            <Text style={[styles.price, { color: colors.text }]}>$9.99<Text style={{ fontSize: 14, color: colors.textSecondary }}>/mo</Text></Text>

            <View style={styles.features}>
                <Text style={[styles.feature, { color: colors.textSecondary }]}>• Unlimited Verifications</Text>
                <Text style={[styles.feature, { color: colors.textSecondary }]}>• Detailed Price Analytics</Text>
                <Text style={[styles.feature, { color: colors.textSecondary }]}>• Priority Support</Text>
            </View>

            <Button
                title="Manage Subscription"
                variant="outline"
                onPress={() => navigation.navigate('Subscription')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.m,
        borderRadius: 16,
        marginBottom: spacing.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    badge: {
        backgroundColor: '#6200ee',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    features: {
        marginBottom: spacing.m,
    },
    feature: {
        marginBottom: 4,
        fontSize: 14,
    },
});
