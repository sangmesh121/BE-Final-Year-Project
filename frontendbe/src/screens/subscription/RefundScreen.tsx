import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

// Mock Data
const transactions = [
    { id: 'tx_123', date: '2026-01-28', amount: '$9.99', item: 'Pro Month', status: 'Completed', eligible: true },
    { id: 'tx_122', date: '2025-12-28', amount: '$9.99', item: 'Pro Month', status: 'Completed', eligible: false }, // Too old
    { id: 'tx_121', date: '2025-11-28', amount: '$9.99', item: 'Pro Month', status: 'Refunded', eligible: false },
];

export const RefundScreen = ({ navigation }: any) => {
    const { colors } = useTheme();
    const [selectedTx, setSelectedTx] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [step, setStep] = useState(1); // 1: Select, 2: Reason, 3: Success

    const handleRequest = () => {
        if (!reason) {
            Alert.alert("Reason Required", "Please provide a reason for the refund.");
            return;
        }
        setStep(3);
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.content}>

                {step === 1 && (
                    <>
                        <Text style={[styles.title, { color: colors.text }]}>Select a Transaction</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Only transactions made within the last 14 days are eligible for a refund.
                        </Text>

                        {transactions.map((tx) => (
                            <TouchableOpacity
                                key={tx.id}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: selectedTx === tx.id ? colors.primary : colors.border,
                                        borderWidth: selectedTx === tx.id ? 2 : 1,
                                        opacity: tx.eligible ? 1 : 0.6
                                    }
                                ]}
                                disabled={!tx.eligible}
                                onPress={() => tx.eligible && setSelectedTx(tx.id)}
                            >
                                <View style={styles.cardRow}>
                                    <View>
                                        <Text style={[styles.itemTitle, { color: colors.text }]}>{tx.item}</Text>
                                        <Text style={[styles.date, { color: colors.textSecondary }]}>{tx.date}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={[styles.amount, { color: colors.text }]}>{tx.amount}</Text>
                                        <Text style={[styles.status, { color: tx.status === 'Refunded' ? colors.textSecondary : tx.eligible ? colors.primary : colors.error }]}>
                                            {tx.status === 'Refunded' ? 'Refunded' : tx.eligible ? 'Eligible' : 'Not Eligible'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text style={[styles.title, { color: colors.text }]}>Why are you requesting a refund?</Text>
                        <TouchableOpacity style={[styles.option, { borderColor: colors.border }]} onPress={() => setReason('Accidental Purchase')}>
                            <Text style={{ color: colors.text }}>Accidental Purchase</Text>
                            {reason === 'Accidental Purchase' && <FontAwesome5 name="check" color={colors.primary} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.option, { borderColor: colors.border }]} onPress={() => setReason('Not what I expected')}>
                            <Text style={{ color: colors.text }}>Not what I expected</Text>
                            {reason === 'Not what I expected' && <FontAwesome5 name="check" color={colors.primary} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.option, { borderColor: colors.border }]} onPress={() => setReason('Duplicate charge')}>
                            <Text style={{ color: colors.text }}>Duplicate charge</Text>
                            {reason === 'Duplicate charge' && <FontAwesome5 name="check" color={colors.primary} />}
                        </TouchableOpacity>
                    </>
                )}

                {step === 3 && (
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                        <FontAwesome5 name="clock" size={64} color="#FF9800" style={{ marginBottom: spacing.m }} />
                        <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>Request Submitted</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
                            Your refund request for {transactions.find(t => t.id === selectedTx)?.amount} is being reviewed. You will receive an update within 24-48 hours.
                        </Text>
                    </View>
                )}

            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                {step < 3 && (
                    <Button
                        title="Continue"
                        onPress={() => step === 1 ? setStep(2) : handleRequest()}
                        disabled={(step === 1 && !selectedTx) || (step === 2 && !reason)}
                        style={{ width: '100%' }}
                    />
                )}
                {step === 3 && (
                    <Button title="Done" onPress={() => navigation.goBack()} style={{ width: '100%' }} />
                )}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: spacing.l,
        lineHeight: 20,
    },
    card: {
        padding: spacing.m,
        borderRadius: 12,
        marginBottom: spacing.m,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    date: {
        fontSize: 12,
        marginTop: 4,
    },
    amount: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    status: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    footer: {
        padding: spacing.m,
        borderTopWidth: 1,
    },
    option: {
        padding: spacing.m,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
