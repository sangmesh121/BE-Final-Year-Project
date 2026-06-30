import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { spacing } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : colors.border,
                        color: colors.text
                    },
                    style
                ]}
                placeholderTextColor={colors.textSecondary}
                {...props}
            />
            {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.m,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: spacing.s / 2,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: spacing.m,
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
});
