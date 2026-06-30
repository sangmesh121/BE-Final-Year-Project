import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
            <View style={[styles.content, { backgroundColor: colors.surface }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.l,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: spacing.s,
        marginLeft: spacing.s,
    },
    content: {
        borderRadius: 12,
        overflow: 'hidden',
    },
});
