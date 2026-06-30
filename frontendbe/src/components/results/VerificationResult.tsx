import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';

interface VerificationResultProps {
    status: 'genuine' | 'suspicious' | 'fake';
    checks: { name: string; status: 'pass' | 'fail' | 'warn'; score: number }[];
}

export const VerificationResult: React.FC<VerificationResultProps> = ({ status, checks }) => {
    const { colors, isDark } = useTheme();

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'genuine': return '#4CAF50';
            case 'fake': return '#F44336';
            case 'suspicious': return '#FFC107';
            default: return colors.text;
        }
    };

    const getStatusIcon = (s: string) => {
        switch (s) {
            case 'genuine': return 'check-circle';
            case 'fake': return 'times-circle';
            case 'suspicious': return 'exclamation-triangle';
            default: return 'question-circle';
        }
    };

    const getCheckIcon = (s: string) => {
        if (s === 'pass') return 'check';
        if (s === 'fail') return 'times';
        return 'exclamation';
    };

    const displayStatus = status === 'fake' ? 'counterfeit' : status;

    return (
        <View style={styles.container}>
            {/* Status Card */}
            <View style={[styles.statusCard, { backgroundColor: colors.surface, borderColor: getStatusColor(status), borderWidth: 2 }]}>
                <FontAwesome5 name={getStatusIcon(status)} size={48} color={getStatusColor(status)} style={{ marginBottom: spacing.m }} />
                <Text style={[styles.statusTitle, { color: colors.text }]}>{displayStatus.toUpperCase()}</Text>
                <Text style={[styles.statusDesc, { color: colors.textSecondary }]}>
                    Based on our AI analysis, this product appears to be {displayStatus}.
                </Text>
            </View>

            {/* Breakdown */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Verification Breakdown</Text>
            <View style={[styles.breakdownCard, { backgroundColor: colors.surface }]}>
                {checks.map((check, index) => (
                    <View key={index} style={[styles.checkRow, { borderBottomColor: colors.border, borderBottomWidth: index === checks.length - 1 ? 0 : 1 }]}>
                        <View style={styles.checkInfo}>
                            <Text style={[styles.checkName, { color: colors.text }]}>{check.name}</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Confidence: {check.score}%</Text>
                        </View>
                        <View style={[styles.checkBadge, { backgroundColor: getStatusColor(check.status === 'pass' ? 'genuine' : check.status === 'fail' ? 'fake' : 'suspicious') + '20' }]}>
                            <FontAwesome5 name={getCheckIcon(check.status)} size={12} color={getStatusColor(check.status === 'pass' ? 'genuine' : check.status === 'fail' ? 'fake' : 'suspicious')} />
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.actions}>
                <Button title="Report Issue" variant="outline" onPress={() => { }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.l,
    },
    statusCard: {
        padding: spacing.l,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    statusTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    statusDesc: {
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    breakdownCard: {
        borderRadius: 12,
        padding: spacing.m,
        marginBottom: spacing.l,
    },
    checkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.m,
    },
    checkInfo: {},
    checkName: {
        fontWeight: '600',
        marginBottom: 2,
    },
    checkBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        gap: spacing.m,
    }
});
