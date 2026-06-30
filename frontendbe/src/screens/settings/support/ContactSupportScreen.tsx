import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { Container } from '../../../components/Container';
import { Button } from '../../../components/common/Button';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../helpers/AuthContext';
import { SupabaseService } from '../../../services/SupabaseService';
import { spacing } from '../../../theme/colors';

export const ContactSupportScreen = ({ navigation }: any) => {
    const { colors } = useTheme();
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!subject || !message) {
            Alert.alert("Missing Information", "Please fill in both subject and message.");
            return;
        }

        if (!user) {
            Alert.alert("Error", "You must be logged in to contact support.");
            return;
        }

        setIsLoading(true);
        try {
            await SupabaseService.createSupportTicket({
                user_id: user.id,
                subject,
                message,
            });

            Alert.alert(
                "Request Sent",
                "We have received your message. Our team will replay shortly.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.message || "Failed to submit ticket.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.content}>

                <Text style={[styles.label, { color: colors.textSecondary }]}>Subject</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    placeholder="e.g., Scan not working"
                    placeholderTextColor={colors.textSecondary}
                    value={subject}
                    onChangeText={setSubject}
                />

                <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.m }]}>Message</Text>
                <TextInput
                    style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                    placeholder="Describe your issue in detail..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={message}
                    onChangeText={setMessage}
                />

                <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        Device Info: iPhone 13 Pro (Mock){'\n'}
                        OS: iOS 17.2{'\n'}
                        App Version: 1.0.0
                    </Text>
                </View>

                <Button
                    title={isLoading ? "Sending..." : "Submit Ticket"}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    style={{ marginTop: spacing.l }}
                />

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
    },
    infoBox: {
        marginTop: spacing.l,
        padding: spacing.m,
        borderRadius: 8,
        borderWidth: 1,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 18,
    }
});
