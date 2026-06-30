import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

const CancellationStep = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const { colors } = useTheme();
    return (
        <View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>{title}</Text>
            {children}
        </View>
    );
};

export const CancellationScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState('');

    const reasons = [
        "Too expensive",
        "Not using it enough",
        "Missing features",
        "Found a better alternative",
        "Other"
    ];

    const renderContent = () => {
        switch (step) {
            case 1: // Impact
                return (
                    <CancellationStep title="We're sorry to see you go">
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>If you cancel now:</Text>
                            <View style={styles.bulletPoint}>
                                <FontAwesome5 name="check" size={14} color={colors.primary} />
                                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>Access remains until Feb 28, 2026</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <FontAwesome5 name="check" size={14} color={colors.primary} />
                                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>Your history and data will be saved</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <FontAwesome5 name="check" size={14} color={colors.primary} />
                                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>You can restart anytime</Text>
                            </View>
                        </View>
                    </CancellationStep>
                );
            case 2: // Reason
                return (
                    <CancellationStep title="Why are you leaving?">
                        {reasons.map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[
                                    styles.option,
                                    { borderColor: reason === r ? colors.primary : colors.border, borderWidth: 1 }
                                ]}
                                onPress={() => setReason(r)}
                            >
                                <Text style={[styles.optionText, { color: colors.text }]}>{r}</Text>
                                {reason === r && <FontAwesome5 name="check-circle" size={16} color={colors.primary} />}
                            </TouchableOpacity>
                        ))}
                    </CancellationStep>
                );
            case 3: // Offer
                return (
                    <CancellationStep title="Wait! A special offer for you">
                        <View style={[styles.offerCard, { backgroundColor: isDark ? '#332a00' : '#fff9c4' }]}>
                            <FontAwesome5 name="gift" size={32} color="#fbc02d" style={{ marginBottom: spacing.m }} />
                            <Text style={[styles.offerTitle, { color: colors.text }]}>Get 50% OFF for 3 Months</Text>
                            <Text style={[styles.offerDesc, { color: colors.textSecondary }]}>
                                Stay with us and pay only $4.99/mo for the next 3 months.
                            </Text>
                            <Button
                                title="Claim Offer"
                                onPress={() => navigation.navigate('Subscription')}
                                style={{ marginTop: spacing.m, width: '100%' }}
                            />
                        </View>
                    </CancellationStep>
                );
            case 4: // Confirm
                return (
                    <CancellationStep title="Final Confirmation">
                        <Text style={[styles.confirmText, { color: colors.textSecondary }]}>
                            Are you sure you want to cancel your subscription? You will lose access to premium features on Feb 28, 2026.
                        </Text>
                    </CancellationStep>
                );
            case 5: // Success
                return (
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                        <FontAwesome5 name="check-circle" size={64} color={colors.primary} style={{ marginBottom: spacing.m }} />
                        <Text style={[styles.stepTitle, { color: colors.text, textAlign: 'center' }]}>Subscription Cancelled</Text>
                        <Text style={[styles.bulletText, { color: colors.textSecondary, textAlign: 'center' }]}>
                            You will receive an email confirmation shortly.
                        </Text>
                    </View>
                );
        }
    };

    const handleNext = () => {
        if (step === 2 && !reason) return; // Require reason
        if (step === 4) {
            setStep(5);
            return;
        }
        setStep(step + 1);
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.content}>
                {renderContent()}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                {step < 5 && (
                    <>
                        <Button
                            title={step === 4 ? "Keep Subscription" : "Back"}
                            variant="outline"
                            onPress={() => step === 1 ? navigation.goBack() : step === 4 ? navigation.goBack() : setStep(step - 1)}
                            style={{ flex: 1, marginRight: spacing.m }}
                        />
                        <Button
                            title={step === 4 ? "Confirm Cancellation" : "Continue"}
                            variant={step === 4 ? "danger" : "primary"}
                            onPress={handleNext}
                            style={{ flex: 1 }}
                            disabled={step === 2 && !reason}
                        />
                    </>
                )}
                {step === 5 && (
                    <Button
                        title="Return to Profile"
                        onPress={() => navigation.navigate('ProfileHome')}
                        style={{ flex: 1 }}
                    />
                )}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.l,
    },
    card: {
        padding: spacing.l,
        borderRadius: 12,
        marginBottom: spacing.l,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    bulletText: {
        marginLeft: spacing.s,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.m,
        borderTopWidth: 1,
    },
    option: {
        padding: spacing.m,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    optionText: {
        fontSize: 16,
    },
    offerCard: {
        padding: spacing.xl,
        borderRadius: 16,
        alignItems: 'center',
    },
    offerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    offerDesc: {
        textAlign: 'center',
        marginBottom: spacing.m,
    },
    confirmText: {
        fontSize: 16,
        lineHeight: 24,
    }
});
