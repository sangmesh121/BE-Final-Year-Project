import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Container } from '../../components/Container';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { supabase } from '../../services/supabase';
import { useTheme } from '../../context/ThemeContext';

import { FontAwesome } from '@expo/vector-icons';
import { Provider } from '@supabase/supabase-js';

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { colors, isDark } = useTheme();

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        }
        setLoading(false);
    };

    const handleSocialLogin = async (provider: Provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
            });
            if (error) Alert.alert('Social Login Error', error.message);
        } catch (err: any) {
            console.error(err);
            Alert.alert('Configuration Error', 'This social provider is not configured in Supabase yet.');
        }
    };

    return (
        <Container centered>
            <View style={[styles.card, { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)' }]}>
                <Text style={[styles.title, { color: colors.primary }]}>Welcome Back</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue</Text>

                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity 
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={{ alignSelf: 'flex-end', marginBottom: 20, marginTop: 5 }}
                >
                    <Text style={{ color: colors.primary, fontSize: 14 }}>Forgot Password?</Text>
                </TouchableOpacity>

                <Button
                    title="Sign In"
                    onPress={handleLogin}
                    loading={loading}
                    style={styles.button}
                />

                <View style={styles.dividerContainer}>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                </View>

                <View style={styles.socialContainer}>
                    <TouchableOpacity onPress={() => handleSocialLogin('google')} style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
                        <FontAwesome name="google" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSocialLogin('facebook')} style={[styles.socialButton, { backgroundColor: '#4267B2' }]}>
                        <FontAwesome name="facebook" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSocialLogin('linkedin')} style={[styles.socialButton, { backgroundColor: '#0077B5' }]}>
                        <FontAwesome name="linkedin" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSocialLogin('instagram' as any)} style={[styles.socialButton, { backgroundColor: '#C13584' }]}>
                        <FontAwesome name="instagram" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <Button
                    title="Create Account"
                    variant="outline"
                    onPress={() => navigation.navigate('Register')}
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
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 12,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 10,
    },
    socialButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});
