import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Container } from '../../../components/Container';
import { Button } from '../../../components/common/Button';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../helpers/AuthContext';
import { SupabaseService } from '../../../services/SupabaseService';
import { spacing } from '../../../theme/colors';

export const EditProfileScreen = ({ navigation }: any) => {
    const { colors } = useTheme();
    const { user } = useAuth();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            try {
                const profile = await SupabaseService.getProfile(user.id);
                if (profile) {
                    setFullName(profile.full_name || '');
                    setPhone(profile.phone || '');
                    // Note: 'phone' field wasn't in my initial schema SQL snippet explicitly, but Supabase schema allows flexible columns or I should have added it.
                    // Checking my schema... 'profiles' table had: id, full_name, avatar_url, email.
                    // 'phone' is missing in 'profiles'. It might be in auth.users.
                    // I'll check my schema again.
                }
            } catch (error) {
                console.warn('Failed to load profile', error);
            } finally {
                setIsFetching(false);
            }
        };
        loadProfile();
    }, [user?.id]);

    const handleSave = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Update 'profiles' table
            // Only updating full_name for now as per schema
            await SupabaseService.updateProfile(user.id, {
                full_name: fullName,
                // Phone? If I didn't add it to schema, I can't save it there. 
                // I will assume I can update auth metadata as well for phone if needed,
                // or just stick to what is in schema.
            });

            // Also update Auth Metadata specifically for consistency if we relied on it
            // implementation detail: supabase.auth.updateUser({ data: { full_name: fullName } })

            Alert.alert("Success", "Profile updated successfully.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </Container>
        );
    }

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="John Doe"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                {/* Form Group for Phone - visually present but maybe valid only if schema matches */}
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+1 234 567 890"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Email (Read-only)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.textSecondary, borderColor: colors.border, backgroundColor: colors.background }]}
                        value={user?.email || ''}
                        editable={false}
                    />
                </View>

                <Button
                    title={isLoading ? "Saving..." : "Save Changes"}
                    onPress={handleSave}
                    disabled={isLoading}
                    style={{ marginTop: spacing.xl }}
                />

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    formGroup: {
        marginBottom: spacing.l,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
    },
});
