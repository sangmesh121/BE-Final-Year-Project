import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { spacing } from '../../theme/colors';

export type ScanMethod = 'camera' | 'upload' | 'url';

interface MethodSelectorProps {
    selectedMethod: ScanMethod;
    onSelect: (method: ScanMethod) => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({ selectedMethod, onSelect }) => {
    const { colors, isDark } = useTheme();

    const methods: { id: ScanMethod; label: string; icon: string }[] = [
        { id: 'camera', label: 'Camera', icon: 'camera' },
        { id: 'upload', label: 'Upload', icon: 'image' },
        { id: 'url', label: 'URL', icon: 'link' },
    ];

    return (
        <View style={styles.container}>
            {methods.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                    <TouchableOpacity
                        key={method.id}
                        onPress={() => onSelect(method.id)}
                        style={[
                            styles.option,
                            {
                                backgroundColor: isSelected ? colors.primary : colors.surface,
                                borderColor: isSelected ? colors.primary : colors.border,
                                borderWidth: 1,
                            }
                        ]}
                    >
                        <FontAwesome5
                            name={method.icon}
                            size={16}
                            color={isSelected ? '#fff' : colors.textSecondary}
                        />
                        <Text style={[
                            styles.label,
                            { color: isSelected ? '#fff' : colors.textSecondary }
                        ]}>
                            {method.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.s,
        marginBottom: spacing.m,
    },
    option: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.s, // Smaller padding for pill look
        paddingHorizontal: spacing.s,
        borderRadius: 20, // Rounded pills
        gap: 6,
    },
    label: {
        fontWeight: '600',
        fontSize: 12,
    },
});
