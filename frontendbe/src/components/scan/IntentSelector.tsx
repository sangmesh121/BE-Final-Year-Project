import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { spacing } from '../../theme/colors';

export type ScanIntent = 'verify' | 'price' | 'details';

interface IntentSelectorProps {
    selectedIntent: ScanIntent;
    onSelect: (intent: ScanIntent) => void;
}

export const IntentSelector: React.FC<IntentSelectorProps> = ({ selectedIntent, onSelect }) => {
    const { colors, isDark } = useTheme();

    const intents: { id: ScanIntent; title: string; desc: string; icon: string }[] = [
        { id: 'verify', title: 'Verify Authenticity', desc: 'Check if product is genuine', icon: 'check-circle' },
        { id: 'price', title: 'Check Pricing', desc: 'Compare prices online', icon: 'tag' },
        { id: 'details', title: 'View Details', desc: 'Specs, reviews & info', icon: 'info-circle' },
    ];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Why are you scanning?</Text>
            {intents.map((intent) => {
                const isSelected = selectedIntent === intent.id;
                return (
                    <TouchableOpacity
                        key={intent.id}
                        onPress={() => onSelect(intent.id)}
                        style={[
                            styles.card,
                            {
                                backgroundColor: colors.surface,
                                borderColor: isSelected ? colors.primary : colors.border,
                                borderWidth: isSelected ? 2 : 1,
                            }
                        ]}
                    >
                        <View style={[
                            styles.iconBox,
                            { backgroundColor: isSelected ? colors.primary + '20' : colors.background }
                        ]}>
                            <FontAwesome5
                                name={intent.icon}
                                size={20}
                                color={isSelected ? colors.primary : colors.textSecondary}
                            />
                        </View>
                        <View style={styles.content}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>{intent.title}</Text>
                            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{intent.desc}</Text>
                        </View>
                        {isSelected && (
                            <FontAwesome5 name="check" size={16} color={colors.primary} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.l,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        borderRadius: 12,
        marginBottom: spacing.s,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    content: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 12,
    },
});
