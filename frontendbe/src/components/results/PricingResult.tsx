import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';

interface PriceOption {
    seller: string;
    price: string;
    currency: string;
    shipping: string;
    rating: number;
    link: string;
    logo?: string;
    best?: boolean;
    availability: 'In stock' | 'Out of stock' | 'Limited stock';
    condition: 'New' | 'Used' | 'Refurbished';
    shippingCost?: string;
}

interface PricingResultProps {
    bestPrice: string;
    averagePrice: string;
    options: PriceOption[];
}

export const PricingResult: React.FC<PricingResultProps> = ({ bestPrice, averagePrice, options }) => {
    const { colors, isDark } = useTheme();

    const getAvailabilityColor = (status: string) => {
        switch (status) {
            case 'In stock': return '#4CAF50';
            case 'Limited stock': return '#FF9800';
            case 'Out of stock': return '#F44336';
            default: return colors.textSecondary;
        }
    };

    const handleStoreVisit = async (link: string, seller: string) => {
        if (!link) {
            alert("No link available for this seller.");
            return;
        }

        try {
            // Try to open the link - will use native app if available
            const supported = await Linking.canOpenURL(link);
            if (supported) {
                await Linking.openURL(link);
            } else {
                alert(`Cannot open link for ${seller}. Please try again.`);
            }
        } catch (err) {
            console.error("Failed to open URL:", err);
            alert(`Could not open ${seller} store. Please check your connection.`);
        }
    };

    return (
        <View style={styles.container}>
            {/* Insights */}
            <View style={[styles.insightCard, { backgroundColor: colors.surface }]}>
                <View style={styles.insightCol}>
                    <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>Lowest Price</Text>
                    <Text style={[styles.insightValue, { color: '#4CAF50' }]}>{bestPrice}</Text>
                </View>
                <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
                <View style={styles.insightCol}>
                    <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>Average Price</Text>
                    <Text style={[styles.insightValue, { color: colors.text }]}>{averagePrice}</Text>
                </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Compare Stores</Text>

            <View style={styles.listContainer}>
                {options.map((item, index) => (
                    <View key={index} style={[
                        styles.optionCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: item.best ? '#4CAF50' : colors.border,
                            borderWidth: item.best ? 2 : 1
                        }
                    ]}>
                        {/* Header: Seller & Price */}
                        <View style={styles.cardHeader}>
                            <View style={styles.sellerRow}>
                                <View style={styles.logoPlaceholder}>
                                    <FontAwesome5 name="store" size={14} color={colors.textSecondary} />
                                </View>
                                <View>
                                    <Text style={[styles.sellerName, { color: colors.text }]}>{item.seller}</Text>
                                    <View style={styles.ratingRow}>
                                        <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating}</Text>
                                        <FontAwesome5 name="star" size={10} color="#FFC107" solid style={{ marginLeft: 2 }} />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.priceContainer}>
                                <Text style={[styles.price, { color: colors.text }]}>{item.price}</Text>
                                {item.best && <Text style={styles.bestDealLabel}>Best Price</Text>}
                            </View>
                        </View>

                        <View style={[styles.divider, { backgroundColor: colors.border }]} />

                        {/* Details Grid */}
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Condition</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>{item.condition}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Availability</Text>
                                <Text style={[styles.detailValue, { color: getAvailabilityColor(item.availability) }]}>
                                    {item.availability}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Shipping</Text>
                                <Text style={[styles.detailValue, { color: colors.text }]}>
                                    {item.shippingCost || item.shipping}
                                </Text>
                            </View>
                        </View>

                        {/* Action Button with improved UX */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.visitBtn,
                                {
                                    backgroundColor: !item.link ? colors.border : colors.primary,
                                    opacity: pressed ? 0.7 : 1,
                                    transform: [{ scale: pressed ? 0.98 : 1 }]
                                }
                            ]}
                            onPress={() => handleStoreVisit(item.link, item.seller)}
                            disabled={!item.link}
                            android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                            <Text style={styles.visitBtnText}>
                                {!item.link ? 'Link Unavailable' : 'Visit Store'}
                            </Text>
                            <FontAwesome5 name="external-link-alt" size={12} color="#fff" />
                        </Pressable>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.l,
    },
    insightCard: {
        flexDirection: 'row',
        padding: spacing.m,
        borderRadius: 12,
        marginBottom: spacing.l,
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 2,
    },
    insightCol: {
        alignItems: 'center',
    },
    insightLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    insightValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    verticalDivider: {
        width: 1,
        height: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    optionCard: {
        borderRadius: 12,
        marginBottom: spacing.m,
        overflow: 'hidden',
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.m,
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.s,
    },
    sellerName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 11,
        marginRight: 2,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    bestDealLabel: {
        fontSize: 10,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        width: '100%',
    },
    detailsGrid: {
        flexDirection: 'row',
        padding: spacing.m,
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 10,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '500',
    },
    visitBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.m,
        gap: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    visitBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    listContainer: {
        gap: spacing.m,
    },
});
