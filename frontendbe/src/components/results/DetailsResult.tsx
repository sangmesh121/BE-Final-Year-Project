import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

interface DetailItem {
    label: string;
    value: string;
}

interface DetailsResultProps {
    description: string;
    specs: DetailItem[];
}

export const DetailsResult: React.FC<DetailsResultProps> = ({ description, specs }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
                {description || 'No detailed description available for this product.'}
            </Text>

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.l }]}>Specifications</Text>
            <View style={[styles.specsCard, { backgroundColor: colors.surface }]}>
                {specs.map((item, index) => (
                    <View key={index} style={[styles.specRow, { borderBottomColor: colors.border, borderBottomWidth: index === specs.length - 1 ? 0 : 1 }]}>
                        <Text style={[styles.specLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                        <Text style={[styles.specValue, { color: colors.text }]}>{item.value}</Text>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    description: {
        lineHeight: 22,
        fontSize: 14,
    },
    specsCard: {
        borderRadius: 12,
        padding: spacing.m,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.m,
    },
    specLabel: {
        fontSize: 14,
    },
    specValue: {
        fontWeight: '600',
        fontSize: 14,
    },
});
