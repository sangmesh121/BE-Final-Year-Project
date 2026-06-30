import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Container } from '../../components/Container';
import { useAuth } from '../../helpers/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

// Settings Components
import { SettingsSection } from '../../components/settings/SettingsSection';
import { SettingsItem } from '../../components/settings/SettingsItem';

export const SettingsScreen = ({ navigation }: any) => {
    const { signOut } = useAuth();
    const { themeMode, setThemeMode } = useTheme();

    const handleSignOut = async () => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm("Are you sure you want to sign out?");
            if (confirmed) {
                await signOut();
            }
        } else {
            Alert.alert(
                "Sign Out",
                "Are you sure you want to sign out?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Sign Out", style: "destructive", onPress: async () => await signOut() }
                ]
            );
        }
    };

    const toggleTheme = () => {
        const nextMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
        setThemeMode(nextMode);
    };

    const getThemeLabel = () => {
        if (themeMode === 'system') return 'System Default';
        return themeMode.charAt(0).toUpperCase() + themeMode.slice(1);
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Account Settings */}
                <SettingsSection title="Account">
                    <SettingsItem icon="user-edit" title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
                    <SettingsItem icon="shield-alt" title="Security & Privacy" onPress={() => navigation.navigate('SecuritySettings')} showBorder={false} />
                </SettingsSection>

                {/* Preferences */}
                <SettingsSection title="Preferences">
                    <SettingsItem
                        icon="moon"
                        title="Theme"
                        value={getThemeLabel()}
                        onPress={toggleTheme}
                    />
                    <SettingsItem
                        icon="bell"
                        title="Notifications"
                        onPress={() => navigation.navigate('NotificationSettings')}
                    />
                    <SettingsItem
                        icon="crosshairs"
                        title="Scan Preferences"
                        onPress={() => navigation.navigate('ScanSettings')}
                        showBorder={false}
                    />
                </SettingsSection>

                {/* Subscription - Already linked but highlighting logic could be here if needed */}
                <SettingsSection title="Subscription">
                    <SettingsItem icon="credit-card" title="Manage Subscription" onPress={() => navigation.navigate('Subscription')} showBorder={false} />
                </SettingsSection>


                {/* Support */}
                <SettingsSection title="Support">
                    <SettingsItem icon="question-circle" title="Help Center" onPress={() => navigation.navigate('HelpCenter')} />
                    <SettingsItem icon="envelope" title="Contact Us" onPress={() => navigation.navigate('ContactSupport')} showBorder={false} />
                </SettingsSection>

                {/* About */}
                <SettingsSection title="About">
                    <SettingsItem icon="info-circle" title="Version" type="value" value="1.0.0 (Build 42)" />
                    <SettingsItem icon="file-contract" title="Legal Information" onPress={() => navigation.navigate('Legal')} showBorder={false} />
                </SettingsSection>

                {/* Logout Button */}
                <SettingsSection title="">
                    <SettingsItem
                        icon="sign-out-alt"
                        title="Sign Out"
                        onPress={handleSignOut}
                        showBorder={false}
                    />
                </SettingsSection>

                <View style={{ height: 40 }} />
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
