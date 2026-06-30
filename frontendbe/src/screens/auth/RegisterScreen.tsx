import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Container } from '../../components/Container';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { supabase } from '../../services/supabase';
import { useTheme } from '../../context/ThemeContext';

export const RegisterScreen = ({ navigation }: any) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { colors, isDark } = useTheme();

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                    }
                }
            });
            console.log('Register response:', { data, error });

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                if (data.session) {
                    Alert.alert('Success', 'Account created and verified!');
                } else if (data.user) {
                    Alert.alert('Success', 'Account created. If email verification is enabled, please check your inbox.');
                }
                navigation.goBack();
            }
        } catch (err) {
            console.error('Register error:', err);
            Alert.alert('Error', 'An unexpected error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container centered>
            <View style={[styles.card, { backgroundColor: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)' }]}>
                <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign up to get started</Text>

                <Input
                    placeholder="Full Name *"
                    value={fullName}
                    onChangeText={setFullName}
                />

                <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <Input
                    placeholder="Email *"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <Input
                    placeholder="Password *"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    title="Sign Up"
                    onPress={handleRegister}
                    loading={loading}
                    style={styles.button}
                />

                <Button
                    title="Already have an account? Login"
                    variant="outline"
                    onPress={() => navigation.goBack()}
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
        marginBottom: 16,
    },
});
