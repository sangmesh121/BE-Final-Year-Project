import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../../../components/Container';
import { useTheme } from '../../../context/ThemeContext';
import { spacing } from '../../../theme/colors';

const LegalSection = ({ title, content }: { title: string, content: string }) => {
    const { colors } = useTheme();
    return (
        <View style={styles.section}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.content, { color: colors.textSecondary }]}>{content}</Text>
        </View>
    );
};

export const LegalScreen = () => {
    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <LegalSection
                    title="Terms of Service"
                    content={`Last Updated: Feb 2026\n\n1. Acceptance of Terms\nBy accessing and using the Antigravity app, you accept and agree to be bound by the terms and provision of this agreement.\n\n2. Use License\nPermission is granted to temporarily download one copy of the materials on Antigravity's website for personal, non-commercial transitory viewing only.\n\n3. Disclaimer\nThe materials on Antigravity's website are provided "as is". Antigravity makes no warranties, expressed or implied.`}
                />

                <LegalSection
                    title="Privacy Policy"
                    content={`Last Updated: Feb 2026\n\n1. Information Collection\nWe collect information to provide better services to all our users. We collect information in the following ways: information you give us and information we get from your use of our services.\n\n2. Data Security\nWe work hard to protect Antigravity and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.`}
                />
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        padding: spacing.l,
    },
    section: {
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    content: {
        fontSize: 14,
        lineHeight: 22,
    },
});
