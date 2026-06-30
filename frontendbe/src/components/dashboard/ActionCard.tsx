import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

interface ActionCardProps {
    title: string;
    subtitle: string;
    icon: string;
    onPress: () => void;
    color?: string;
    style?: ViewStyle;
}

export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    subtitle,
    icon,
    onPress,
    color,
    style
}) => {
    const { colors, isDark } = useTheme();
    const iconColor = color || colors.primary;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: isDark ? 1 : 0,
                },
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : iconColor + '15' }]}>
                <FontAwesome5 name={icon} size={24} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: spacing.m,
        borderRadius: 16,
        marginBottom: spacing.m,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
});
