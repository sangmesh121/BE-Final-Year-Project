import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../helpers/AuthContext';
import { SupabaseService } from '../../services/SupabaseService';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

import { HistoryItem } from '../../components/history/HistoryItem';
import { HistoryFilters } from '../../components/history/HistoryFilters';

export const HistoryScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const [scans, setScans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchHistory = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await SupabaseService.getUserHistory(user.id, page, 5);
            const data = response.data || [];
            setTotalPages(response.totalPages);

            // Transform data for UI
            const formatted = data.map((item: any) => {
                const result = item.scan_results?.[0] || {};
                const price = item.price_results?.[0] || {};

                let statusText = 'Pending';
                let statusColor = '#666';

                if (item.intent === 'verify') {
                    statusText = result.authenticity_status || 'Unknown';
                    statusColor = statusText === 'Genuine' ? '#4CAF50' :
                        statusText === 'Fake' ? '#F44336' : '#FFC107';
                } else if (item.intent === 'price') {
                    statusText = price.price ? `$${price.price}` : 'No Price';
                    statusColor = '#4CAF50';
                } else {
                    statusText = 'Viewed';
                }

                return {
                    id: item.id,
                    name: result.product_name || 'Unknown Product',
                    brand: result.brand || 'Unknown Brand',
                    image: item.image_url || 'https://via.placeholder.com/150',
                    frontImage: item.front_image_url,
                    backImage: item.back_image_url,
                    date: new Date(item.created_at).toLocaleDateString(),
                    intent: item.intent,
                    inputType: item.input_type,
                    status: statusText,
                    statusColor: statusColor,
                    fullData: item
                };
            });
            setScans(formatted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [user?.id, page]);

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [fetchHistory])
    );

    // Filter Logic
    const filteredData = scans.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = false;
        if (activeFilter === 'all') {
            matchesFilter = true;
        } else if (activeFilter === 'camera' || activeFilter === 'upload') {
            matchesFilter = item.inputType === activeFilter;
        } else {
            matchesFilter = item.intent === activeFilter;
        }

        return matchesSearch && matchesFilter;
    });

    const handlePress = (item: any) => {
        // We pass the full scan result data to the result screen
        // In a real app, we might just pass ID and let Result fetch, but we have data already.
        navigation.navigate('ScanTab', {
            screen: 'ScanResult',
            params: {
                method: 'history',
                intent: item.intent,
                data: item.image,
                frontImage: item.frontImage,
                backImage: item.backImage,
                mockResult: item.fullData?.scan_results?.[0]
            }
        });
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                <FontAwesome5 name="history" size={40} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No History Yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Scan your first product to see it here.
            </Text>
            <Button
                title="Scan Product"
                onPress={() => navigation.navigate('ScanTab', { screen: 'ScanScreen' })}
                style={{ marginTop: spacing.l, width: 200 }}
            />
        </View>
    );

    return (
        <Container>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>History</Text>

                {/* Search Bar */}
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <FontAwesome5 name="search" size={16} color={colors.textSecondary} style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Search products..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={[styles.input, { color: colors.text }]}
                    />
                    {searchQuery.length > 0 && (
                        <FontAwesome5 name="times" size={16} color={colors.textSecondary} onPress={() => setSearchQuery('')} />
                    )}
                </View>
            </View>

            <HistoryFilters activeFilter={activeFilter} onSelect={setActiveFilter} />

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <HistoryItem item={item} onPress={() => handlePress(item)} />}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Pagination Controls */}
            {!loading && scans.length > 0 && (
                <View style={styles.paginationContainer}>
                    <Button
                        title="Previous"
                        onPress={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        variant="outline"
                        style={{ width: 100 }}
                    />
                    <Text style={[styles.pageText, { color: colors.text }]}>
                        Page {page} of {totalPages}
                    </Text>
                    <Button
                        title="Next"
                        onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        variant="outline"
                        style={{ width: 100 }}
                    />
                </View>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: spacing.m,
        marginBottom: spacing.m,
        marginTop: spacing.s,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        height: '100%',
    },
    list: {
        paddingHorizontal: spacing.m,
        paddingBottom: spacing.xl,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    emptyText: {
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.m,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    pageText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
