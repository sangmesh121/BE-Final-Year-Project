import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

interface HistoryItemProps {
    item: {
        id: string;
        name: string;
        brand: string;
        image: string;
        date: string;
        intent: 'verify' | 'price' | 'details';
        status: string; // e.g. "Genuine", "Best: $120", "Viewed"
        statusColor?: string;
    };
    onPress: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress }) => {
    const { colors, isDark } = useTheme();

    const getIntentIcon = () => {
        switch (item.intent) {
            case 'verify': return 'check-circle';
            case 'price': return 'tag';
            case 'details': return 'info-circle';
            default: return 'history';
        }
    };

    const getIntentColor = () => {
        switch (item.intent) {
            case 'verify': return colors.primary; // Purple
            case 'price': return '#4CAF50'; // Green
            case 'details': return '#FF9800'; // Orange
            default: return colors.textSecondary;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: isDark ? 1 : 0
                }
            ]}
            onPress={onPress}
        >
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.brand, { color: colors.textSecondary }]}>{item.brand}</Text>
                    <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
                </View>

                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>

                <View style={styles.footer}>
                    {/* Intent Badge */}
                    <View style={[styles.intentBadge, { backgroundColor: getIntentColor() + '20' }]}>
                        <FontAwesome5 name={getIntentIcon()} size={10} color={getIntentColor()} />
                        <Text style={[styles.intentText, { color: getIntentColor() }]}>
                            {item.intent === 'verify' ? 'Verification' : item.intent === 'price' ? 'Pricing' : 'Details'}
                        </Text>
                    </View>

                    {/* Status */}
                    <Text style={[styles.status, { color: item.statusColor || colors.text }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.arrow}>
                <FontAwesome5 name="chevron-right" size={14} color={colors.textSecondary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: spacing.m,
        borderRadius: 12,
        marginBottom: spacing.m,
        alignItems: 'center',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginRight: spacing.m,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    brand: {
        fontSize: 10,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    date: {
        fontSize: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    intentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    intentText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
    },
    arrow: {
        marginLeft: spacing.s,
    },
});
