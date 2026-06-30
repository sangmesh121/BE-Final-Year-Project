import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

interface RecentActivityProps {
    recentScans?: any[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ recentScans = [] }) => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<any>();

    const renderItem = ({ item }: { item: any }) => {
        const result = item.scan_results?.[0] || {};
        const isAuthentic = result.is_authentic === true || result.status === 'authentic';
        const isFake = result.is_authentic === false || result.status === 'counterfeit' || result.status === 'fake';
        const statusText = isAuthentic ? 'Verified' : isFake ? 'Fake' : 'Unknown';
        const color = isAuthentic ? '#4CAF50' : isFake ? '#F44336' : '#FFC107';
        
        let dateStr = 'Just now';
        if (item.created_at) {
            dateStr = new Date(item.created_at).toLocaleDateString();
        }

        const name = item.intent === 'price' ? 'Price Check' : item.intent === 'details' ? 'Details' : 'Verification';

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.surface,
                        borderWidth: isDark ? 1 : 0,
                        borderColor: colors.border
                    }
                ]}
                onPress={() => navigation.navigate('History')}
            >
                <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
                    <Text style={[styles.date, { color: colors.textSecondary }]}>{dateStr}</Text>
                    <View style={[
                        styles.badge,
                        { backgroundColor: color }
                    ]}>
                        <Text style={styles.badgeText}>{statusText}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Recent Activity</Text>
                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                    <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
                </TouchableOpacity>
            </View>
            {recentScans.length > 0 ? (
                <FlatList
                    data={recentScans}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={{color: colors.textSecondary, paddingVertical: 10, textAlign: 'center'}}>No recent activity found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAll: {
        fontWeight: '600',
    },
    list: {
        paddingRight: spacing.m, // Add padding at end of scroll
    },
    card: {
        width: 160,
        marginRight: spacing.m,
        borderRadius: 12,
        overflow: 'hidden',
        // Shadow
        shadowColor: '#000',
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        paddingBottom: spacing.s,
    },
    image: {
        width: '100%',
        height: 100,
        backgroundColor: '#eee',
    },
    info: {
        padding: spacing.s,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        marginBottom: 6,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
