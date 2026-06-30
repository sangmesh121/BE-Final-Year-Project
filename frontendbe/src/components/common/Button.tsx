import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { spacing } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'medium',
    loading,
    style,
    disabled,
    ...props
}) => {
    const { colors } = useTheme();

    const getBackgroundColor = () => {
        if (disabled) return colors.border; // Use border color for disabled bg in dark mode
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.secondary;
            case 'danger': return colors.error;
            case 'outline': return 'transparent';
            default: return colors.primary;
        }
    };

    const getButtonSizeStyles = () => {
        switch (size) {
            case 'small': return { paddingVertical: spacing.s, paddingHorizontal: spacing.m };
            case 'large': return { paddingVertical: spacing.l, paddingHorizontal: spacing.xl };
            default: return { paddingVertical: spacing.m, paddingHorizontal: spacing.l };
        }
    };

    const getTextSizeStyles = () => {
        switch (size) {
            case 'small': return { fontSize: 14 };
            case 'large': return { fontSize: 18 };
            default: return { fontSize: 16 };
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.textSecondary;
        switch (variant) {
            case 'outline': return colors.primary;
            case 'secondary': return '#000000'; // Secondary is teal, usually needs black text
            default: return colors.white;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.baseButton,
                getButtonSizeStyles(),
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && { borderWidth: 1, borderColor: colors.primary },
                style
            ]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.baseText, getTextSizeStyles(), { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    // Deprecated, specific sizes handled in function
    button: {},
    baseText: {
        fontWeight: '600',
    },
    text: {},
});
