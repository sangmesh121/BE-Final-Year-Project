import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

interface HistoryFiltersProps {
    activeFilter: string;
    onSelect: (filter: string) => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({ activeFilter, onSelect }) => {
    const { colors } = useTheme();

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'verify', label: 'Verification' },
        { id: 'price', label: 'Pricing' },
        { id: 'details', label: 'Product Details' },
        { id: 'camera', label: 'Scans' },
        { id: 'upload', label: 'Uploads' },
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
            style={{ maxHeight: 50, minHeight: 50, flexGrow: 0, marginBottom: 10 }}
        >
            {filters.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                    <TouchableOpacity
                        key={filter.id}
                        onPress={() => onSelect(filter.id)}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isActive ? colors.primary : colors.surface,
                                borderColor: isActive ? colors.primary : colors.border,
                                borderWidth: 1,
                            }
                        ]}
                    >
                        <Text style={[
                            styles.label,
                            { color: isActive ? '#fff' : colors.textSecondary }
                        ]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.m,
        gap: spacing.s,
        paddingBottom: spacing.m,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});
