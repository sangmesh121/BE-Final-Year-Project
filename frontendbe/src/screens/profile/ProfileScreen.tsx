import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container } from '../../components/Container';
import { useAuth } from '../../helpers/AuthContext';
import { SupabaseService } from '../../services/SupabaseService';
import { spacing } from '../../theme/colors';
import { Button } from '../../components/common/Button';

// Components
import { ProfileSummaryCard } from '../../components/settings/ProfileSummaryCard';
import { AccountOverview } from '../../components/profile/AccountOverview';
import { UsageInsights } from '../../components/profile/UsageInsights';
import { SubscriptionCard } from '../../components/profile/SubscriptionCard';

export const ProfileScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async () => {
        if (!user) return;
        try {
            const data = await SupabaseService.getProfile(user.id);
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [loadProfile])
    );

    if (loading && !profile) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            </Container>
        );
    }

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Identity Header */}
                <ProfileSummaryCard
                    name={profile?.full_name || user?.user_metadata?.full_name || 'User'}
                    email={user?.email || ''}
                    isPremium={true} // Mock subscription for now
                    onEditPress={() => navigation.navigate('EditProfile')}
                />

                {/* Main Dashboard Content */}
                <AccountOverview />
                <UsageInsights />
                <SubscriptionCard />

                {/* Settings Shortcut */}
                <Button
                    title="App Settings"
                    variant="secondary"
                    onPress={() => navigation.navigate('Settings')}
                    style={{ marginTop: spacing.m, marginBottom: spacing.xl }}
                />
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingTop: spacing.m,
        paddingBottom: spacing.xl,
    },
});
