import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Container } from '../../components/Container';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { supabase } from '../../services/supabase';
import { useTheme } from '../../context/ThemeContext';

export const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { colors, isDark } = useTheme();

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:8081/reset-password', // Change this in production
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Password reset instructions have been sent to your email.');
            navigation.goBack();
        }
        setLoading(false);
    };

    return (
        <Container centered>
            <View style={[styles.card, { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]}>
                <Text style={[styles.title, { color: colors.primary }]}>Reset Password</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter your email to receive a reset link</Text>

                <Input
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Button
                    title="Send Reset Link"
                    onPress={handleResetPassword}
                    loading={loading}
                    style={styles.button}
                />

                <Button
                    title="Back to Login"
                    variant="outline"
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 20 }}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        marginTop: 10,
    },
});
