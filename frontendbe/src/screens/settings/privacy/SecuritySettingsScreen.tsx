import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, Modal, View, Text, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Container } from '../../../components/Container';
import { SettingsItem } from '../../../components/settings/SettingsItem';
import { SettingsSection } from '../../../components/settings/SettingsSection';
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../../helpers/AuthContext';
import { SupabaseService } from '../../../services/SupabaseService';
import { useTheme } from '../../../context/ThemeContext';
import { spacing } from '../../../theme/colors';

export const SecuritySettingsScreen = ({ navigation }: any) => {
    const { user, signOut } = useAuth();
    const { colors } = useTheme();
    const [biometricsEnabled, setBiometricsEnabled] = useState(false);
    const [pinEnabled, setPinEnabled] = useState(true);

    // Password Change Modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Delete Account Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const bio = await AsyncStorage.getItem('biometric_enabled');
            const pin = await AsyncStorage.getItem('pin_enabled');
            if (bio !== null) setBiometricsEnabled(bio === 'true');
            if (pin !== null) setPinEnabled(pin === 'true');
        } catch (e) {
            console.error("Failed to load security settings");
        }
    };

    const toggleBiometrics = async (value: boolean) => {
        setBiometricsEnabled(value);
        await AsyncStorage.setItem('biometric_enabled', String(value));
    };

    const togglePin = async (value: boolean) => {
        setPinEnabled(value);
        await AsyncStorage.setItem('pin_enabled', String(value));
    };

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in both fields.");
            return;
        }

        if (newPassword.length < 6) {
            if (Platform.OS === 'web') window.alert("Password must be at least 6 characters.");
            else Alert.alert("Error", "Password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            if (Platform.OS === 'web') window.alert("Passwords do not match.");
            else Alert.alert("Error", "Passwords do not match.");
            return;
        }

        setIsChangingPassword(true);
        try {
            await SupabaseService.updatePassword(newPassword);
            if (Platform.OS === 'web') {
                window.alert("Your password has been changed successfully. Please log in again.");
            } else {
                Alert.alert("Success", "Your password has been changed successfully. Please log in again.");
            }
            setShowPasswordModal(false);
            setNewPassword('');
            setConfirmPassword('');
            await signOut();
        } catch (error: any) {
            if (Platform.OS === 'web') {
                window.alert(error.message || "Failed to change password.");
            } else {
                Alert.alert("Error", error.message || "Failed to change password.");
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleExportData = async () => {
        if (!user) return;

        Alert.alert(
            "Export My Data",
            "This will generate a PDF report of all your data. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Export",
                    onPress: async () => {
                        try {
                            // Fetch all user data
                            const userData = await SupabaseService.getFullUserData(user.id);

                            // Generate HTML for PDF
                            const html = `
                                <html>
                                <head>
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                                    <style>
                                        body { font-family: Arial, sans-serif; padding: 20px; }
                                        h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
                                        h2 { color: #555; margin-top: 20px; }
                                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                        th { background-color: #4CAF50; color: white; }
                                        .meta { color: #888; font-size: 12px; margin-bottom: 20px; }
                                    </style>
                                </head>
                                <body>
                                    <h1>Trustify - Personal Data Report</h1>
                                    <p class="meta">Generated on: ${new Date(userData.exported_at).toLocaleString()}</p>
                                    
                                    <h2>Profile Information</h2>
                                    <table>
                                        <tr><th>Field</th><th>Value</th></tr>
                                        <tr><td>Email</td><td>${user.email}</td></tr>
                                        <tr><td>Full Name</td><td>${userData.profile?.full_name || 'N/A'}</td></tr>
                                        <tr><td>Account Created</td><td>${userData.profile?.created_at ? new Date(userData.profile.created_at).toLocaleDateString() : 'N/A'}</td></tr>
                                    </table>

                                    <h2>Settings</h2>
                                    <table>
                                        <tr><th>Setting</th><th>Value</th></tr>
                                        <tr><td>Theme</td><td>${userData.settings?.theme || 'system'}</td></tr>
                                        <tr><td>Language</td><td>${userData.settings?.language || 'en'}</td></tr>
                                        <tr><td>Default Scan Intent</td><td>${userData.settings?.default_scan_intent || 'Verify'}</td></tr>
                                        <tr><td>Notifications</td><td>${userData.settings?.notifications_enabled ? 'Enabled' : 'Disabled'}</td></tr>
                                    </table>

                                    <h2>Scan History</h2>
                                    <p>Total Scans: ${userData.scans?.length || 0}</p>
                                    ${userData.scans && userData.scans.length > 0 ? `
                                        <table>
                                            <tr><th>Date</th><th>Type</th><th>Intent</th></tr>
                                            ${userData.scans.map((scan: any) => `
                                                <tr>
                                                    <td>${new Date(scan.created_at).toLocaleDateString()}</td>
                                                    <td>${scan.input_type}</td>
                                                    <td>${scan.intent}</td>
                                                </tr>
                                            `).join('')}
                                        </table>
                                    ` : '<p>No scans found.</p>'}

                                    <h2>Support Tickets</h2>
                                    <p>Total Tickets: ${userData.support_tickets?.length || 0}</p>
                                    ${userData.support_tickets && userData.support_tickets.length > 0 ? `
                                        <table>
                                            <tr><th>Date</th><th>Subject</th><th>Status</th></tr>
                                            ${userData.support_tickets.map((ticket: any) => `
                                                <tr>
                                                    <td>${new Date(ticket.created_at).toLocaleDateString()}</td>
                                                    <td>${ticket.subject}</td>
                                                    <td>${ticket.status}</td>
                                                </tr>
                                            `).join('')}
                                        </table>
                                    ` : '<p>No support tickets found.</p>'}
                                </body>
                                </html>
                            `;

                            // Generate PDF
                            const { uri } = await Print.printToFileAsync({ html });

                            // Share PDF
                            if (await Sharing.isAvailableAsync()) {
                                await Sharing.shareAsync(uri, {
                                    mimeType: 'application/pdf',
                                    dialogTitle: 'Export Your Data',
                                    UTI: 'com.adobe.pdf'
                                });
                            } else {
                                Alert.alert("Success", `PDF saved to: ${uri}`);
                            }
                        } catch (error: any) {
                            console.error(error);
                            Alert.alert("Error", error.message || "Failed to export data.");
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') {
            Alert.alert("Error", "Please type 'DELETE' exactly to confirm.");
            return;
        }

        if (!user) return;

        setIsDeleting(true);
        try {
            await SupabaseService.deleteUserAccount(user.id);
            // signOut is called in deleteUserAccount
            setShowDeleteModal(false);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete account.");
            setIsDeleting(false);
        }
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.content}>

                <SettingsSection title="Login Security">
                    <SettingsItem
                        icon="key"
                        title="Change Password"
                        onPress={() => setShowPasswordModal(true)}
                    />
                    <SettingsItem
                        icon="fingerprint"
                        title="Biometric Login"
                        type="toggle"
                        value={biometricsEnabled}
                        onToggle={toggleBiometrics}
                    />
                    <SettingsItem
                        icon="lock"
                        title="App PIN"
                        type="toggle"
                        value={pinEnabled}
                        onToggle={togglePin}
                        showBorder={false}
                    />
                </SettingsSection>

                <SettingsSection title="Account Data">
                    <SettingsItem
                        icon="download"
                        title="Export My Data"
                        onPress={handleExportData}
                        showBorder={false}
                    />
                </SettingsSection>

                <SettingsSection title="Danger Zone">
                    <SettingsItem
                        icon="trash-alt"
                        title="Delete Account"
                        type="danger"
                        onPress={handleDeleteAccount}
                        showBorder={false}
                    />
                </SettingsSection>

            </ScrollView>

            {/* Change Password Modal */}
            <Modal
                visible={showPasswordModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPasswordModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Change Password</Text>

                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                            placeholder="New Password"
                            placeholderTextColor={colors.textSecondary}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                            placeholder="Confirm Password"
                            placeholderTextColor={colors.textSecondary}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => setShowPasswordModal(false)}
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <Button
                                title={isChangingPassword ? "Changing..." : "Change"}
                                onPress={handleChangePassword}
                                disabled={isChangingPassword}
                                loading={isChangingPassword}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete Account Confirmation Modal */}
            <Modal
                visible={showDeleteModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: '#F44336' }]}>⚠️ Delete Account</Text>

                        <Text style={[styles.warningText, { color: colors.text }]}>
                            This action is IRREVERSIBLE. All your data will be permanently deleted:
                        </Text>
                        <Text style={[styles.warningList, { color: colors.textSecondary }]}>
                            • Profile information{'\n'}
                            • Scan history{'\n'}
                            • Settings{'\n'}
                            • Support tickets
                        </Text>

                        <Text style={[styles.confirmLabel, { color: colors.text }]}>
                            Type <Text style={{ fontWeight: 'bold', color: '#F44336' }}>DELETE</Text> to confirm:
                        </Text>

                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: '#F44336', backgroundColor: colors.background }]}
                            placeholder="Type DELETE here"
                            placeholderTextColor={colors.textSecondary}
                            value={deleteConfirmation}
                            onChangeText={setDeleteConfirmation}
                            autoCapitalize="characters"
                        />

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmation('');
                                }}
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <Button
                                title={isDeleting ? "Deleting..." : "Delete Account"}
                                onPress={confirmDeleteAccount}
                                disabled={isDeleting || deleteConfirmation !== 'DELETE'}
                                loading={isDeleting}
                                style={{ flex: 1, backgroundColor: '#F44336' }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingTop: spacing.m,
        paddingBottom: spacing.xl,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.l,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: spacing.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.l,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: spacing.m,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: spacing.m,
    },
    warningText: {
        fontSize: 14,
        marginBottom: spacing.s,
        lineHeight: 20,
    },
    warningList: {
        fontSize: 13,
        marginBottom: spacing.m,
        lineHeight: 20,
        paddingLeft: spacing.s,
    },
    confirmLabel: {
        fontSize: 14,
        marginBottom: spacing.s,
        fontWeight: '600',
    },
});
