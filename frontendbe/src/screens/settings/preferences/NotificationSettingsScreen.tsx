import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Container } from '../../../components/Container';
import { SettingsItem } from '../../../components/settings/SettingsItem';
import { SettingsSection } from '../../../components/settings/SettingsSection';
import { spacing } from '../../../theme/colors';

export const NotificationSettingsScreen = () => {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [marketingEnabled, setMarketingEnabled] = useState(false);
    const [securityAlerts, setSecurityAlerts] = useState(true);

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.content}>

                <SettingsSection title="Push Notifications">
                    <SettingsItem
                        icon="bell"
                        title="Allow Push Notifications"
                        type="toggle"
                        value={pushEnabled}
                        onToggle={setPushEnabled}
                        showBorder={false}
                    />
                </SettingsSection>

                <SettingsSection title="Email Preferences">
                    <SettingsItem
                        icon="envelope"
                        title="Email Updates"
                        type="toggle"
                        value={emailEnabled}
                        onToggle={setEmailEnabled}
                    />
                    <SettingsItem
                        icon="bullhorn"
                        title="Marketing & Offers"
                        type="toggle"
                        value={marketingEnabled}
                        onToggle={setMarketingEnabled}
                        showBorder={false}
                    />
                </SettingsSection>

                <SettingsSection title="Security">
                    <SettingsItem
                        icon="shield-alt"
                        title="Security Alerts"
                        type="toggle"
                        value={securityAlerts}
                        onToggle={setSecurityAlerts} // Often forced true in real apps, but toggle here for demo
                        showBorder={false}
                    />
                </SettingsSection>

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingTop: spacing.m,
        paddingBottom: spacing.xl,
    },
});
