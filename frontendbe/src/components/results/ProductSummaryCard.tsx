import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

interface ProductSummaryProps {
    image?: string;
    frontImage?: string;
    backImage?: string;
    name: string;
    brand: string;
    sku?: string;
    description?: string;
    confidence: number;
    style?: ViewStyle;
}

export const ProductSummaryCard: React.FC<ProductSummaryProps> = ({
    image, frontImage, backImage, name, brand, sku, description, confidence, style
}) => {
    const { colors, isDark } = useTheme();

    const getConfidenceColor = (score: number) => {
        if (score >= 90) return '#4CAF50';
        if (score >= 70) return '#FFC107';
        return '#F44336';
    };

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: colors.surface,
                shadowColor: '#000',
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0
            },
            style
        ]}>
            <View>
                {frontImage && backImage ? (
                    <View style={styles.dualImageContainer}>
                        <Image source={{ uri: frontImage }} style={styles.dualImage} />
                        <Image source={{ uri: backImage }} style={styles.dualImage} />
                    </View>
                ) : (
                    <Image source={{ uri: frontImage || backImage || image }} style={styles.image} />
                )}
            </View>
            <View style={styles.info}>
                <Text style={[styles.brand, { color: colors.textSecondary }]}>{brand}</Text>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{name}</Text>
                {sku && <Text style={[styles.sku, { color: colors.textSecondary }]}>SKU: {sku}</Text>}
                {description && <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{description}</Text>}

                <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(confidence) + '20' }]}>
                    <FontAwesome5 name="magic" size={12} color={getConfidenceColor(confidence)} />
                    <Text style={[styles.confidenceText, { color: getConfidenceColor(confidence) }]}>
                        {confidence}% Match
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: spacing.m,
        borderRadius: 12,
        marginBottom: spacing.m,
        // Shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginRight: spacing.m,
    },
    dualImageContainer: {
        flexDirection: 'column',
        marginRight: spacing.m,
        gap: 4,
    },
    dualImage: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#eee',
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    brand: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sku: {
        fontSize: 12,
        marginBottom: 8,
    },
    confidenceBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 6,
    },
    confidenceText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    description: {
        fontSize: 12,
        marginBottom: 8,
        fontStyle: 'italic',
    },
});
