import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

// Components
import { PlanCard } from '../../components/subscription/PlanCard';
import { PaymentMethodSelector } from '../../components/subscription/PaymentMethodSelector';

export const SubscriptionScreen = ({ navigation }: any) => {
    const { colors } = useTheme();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpgrade = () => {
        setIsProcessing(true);
        // Mock API call
        setTimeout(() => {
            setIsProcessing(false);
            Alert.alert(
                "Subscription Successful",
                `You have upgraded to the ${selectedPlan.toUpperCase()} plan via ${paymentMethod}.`,
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        }, 2000);
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header Text */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Choose Your Plan</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Unlock unlimited scans and premium features.
                    </Text>
                </View>

                {/* Billing Cycle Toggle */}
                <View style={[styles.toggleContainer, { backgroundColor: colors.border }]}>
                    <Button
                        title="Monthly"
                        variant={billingCycle === 'monthly' ? 'primary' : 'outline'}
                        onPress={() => setBillingCycle('monthly')}
                        style={{ flex: 1 }}
                    />
                    <Button
                        title="Yearly (Save 20%)"
                        variant={billingCycle === 'yearly' ? 'primary' : 'outline'}
                        onPress={() => setBillingCycle('yearly')}
                        style={{ flex: 1 }}
                    />
                </View>

                {/* Plans */}
                <PlanCard
                    name="Basic"
                    price={billingCycle === 'monthly' ? "Free" : "Free"}
                    period="forever"
                    features={['5 Scans / day', 'Basic Verification', 'Standard Support']}
                    isSelected={selectedPlan === 'basic'}
                    onSelect={() => setSelectedPlan('basic')}
                />

                <PlanCard
                    name="Pro"
                    price={billingCycle === 'monthly' ? "$9.99" : "$95.00"}
                    period={billingCycle === 'monthly' ? "mo" : "yr"}
                    features={['Unlimited Scans', 'Advanced AI Verification', 'Price History', 'Priority Support']}
                    isBestValue={true}
                    isSelected={selectedPlan === 'pro'}
                    onSelect={() => setSelectedPlan('pro')}
                />

                {/* Payment Method (Only if Pro selected) */}
                {selectedPlan === 'pro' && (
                    <>
                        <PaymentMethodSelector
                            selectedMethod={paymentMethod}
                            onSelect={setPaymentMethod}
                        />

                        <Button
                            title={isProcessing ? "Processing..." : `Upgrade to Pro`}
                            onPress={handleUpgrade}
                            disabled={isProcessing}
                            style={{ marginTop: spacing.m, marginBottom: spacing.l }}
                        >
                            {isProcessing && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
                        </Button>
                    </>
                )}

                {/* Billing History Section */}
                <View style={styles.historySection}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.m }}>
                        <Text style={[styles.historyTitle, { color: colors.text }]}>Billing History</Text>
                        <Button
                            title="Request Refund"
                            variant="outline"
                            onPress={() => navigation.navigate('Refund')}
                            style={{ paddingVertical: 4, paddingHorizontal: 8 }}
                        />
                    </View>
                    <View style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                        <View>
                            <Text style={[styles.historyDate, { color: colors.text }]}>Jan 28, 2026</Text>
                            <Text style={[styles.historyDesc, { color: colors.textSecondary }]}>Pro Plan - Monthly</Text>
                        </View>
                        <Text style={[styles.historyAmount, { color: colors.text }]}>$9.99</Text>
                    </View>

                    <Button
                        title="Cancel Subscription"
                        variant="danger"
                        onPress={() => navigation.navigate('Cancellation')}
                        style={{ marginTop: spacing.xl, borderColor: colors.error, borderWidth: 1 }}
                    />
                </View>

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingVertical: spacing.l,
        paddingHorizontal: spacing.m,
    },
    header: {
        marginBottom: spacing.l,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 12,
        marginBottom: spacing.l,
    },
    historySection: {
        marginTop: spacing.l,
        marginBottom: spacing.xl,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    historyDate: {
        fontWeight: 'bold',
    },
    historyDesc: {
        fontSize: 12,
    },
    historyAmount: {
        fontWeight: 'bold',
    },
});
