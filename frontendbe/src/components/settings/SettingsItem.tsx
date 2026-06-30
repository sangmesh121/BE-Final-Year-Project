import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

interface SettingsItemProps {
    icon: string;
    title: string;
    type?: 'link' | 'toggle' | 'value' | 'danger';
    value?: string | boolean;
    onPress?: () => void;
    onToggle?: (val: boolean) => void;
    showBorder?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
    icon, title, type = 'link', value, onPress, onToggle, showBorder = true
}) => {
    const { colors, isDark } = useTheme();

    const renderRightElement = () => {
        if (type === 'toggle') {
            return (
                <Switch
                    value={value as boolean}
                    onValueChange={onToggle}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={'#fff'}
                // IOs style handled by platform defaults mostly
                />
            );
        }

        if (type === 'value') {
            return <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>;
        }

        return (
            <View style={styles.row}>
                {value && <Text style={[styles.value, { color: colors.textSecondary, marginRight: 8 }]}>{value}</Text>}
                <FontAwesome5 name="chevron-right" size={12} color={colors.textSecondary} />
            </View>
        );
    };

    const isDanger = type === 'danger';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: colors.surface },
                showBorder && { borderBottomWidth: 1, borderBottomColor: colors.border }
            ]}
            onPress={type === 'toggle' ? undefined : onPress}
            activeOpacity={type === 'toggle' ? 1 : 0.7}
        >
            <View style={styles.left}>
                <View style={[styles.iconBox, { backgroundColor: isDanger ? '#ffebee' : colors.background }]}>
                    <FontAwesome5
                        name={icon}
                        size={16}
                        color={isDanger ? '#F44336' : colors.text}
                    />
                </View>
                <Text style={[
                    styles.title,
                    { color: isDanger ? '#F44336' : colors.text }
                ]}>
                    {title}
                </Text>
            </View>

            <View>
                {renderRightElement()}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.m,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 14,
    },
});
