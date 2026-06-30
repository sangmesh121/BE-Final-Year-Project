import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '../components/Container';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = ({ navigation }: any) => {
    return (
        <Container>
            <View style={styles.header}>
                <Text style={styles.title}>AntiGravity</Text>
                <Text style={styles.subtitle}>Product Verification & Analysis</Text>
            </View>

            <View style={styles.content}>

                {/* Verify Card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('ScanScreen', { intent: 'verify' })}
                >
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                        <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Verify Authenticity</Text>
                        <Text style={styles.cardDesc}>Check if a product is genuine or fake.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Price Card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('ScanScreen', { intent: 'price' })}
                >
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                        <Ionicons name="pricetag" size={32} color="#2196F3" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Check Price</Text>
                        <Text style={styles.cardDesc}>Find best online prices and sellers.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Details Card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('ScanScreen', { intent: 'details' })}
                >
                    <View style={[styles.iconBox, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                        <Ionicons name="book" size={32} color="#9C27B0" />
                    </View>
                    <View style={styles.cardText}>
                        <Text style={styles.cardTitle}>Product Details</Text>
                        <Text style={styles.cardDesc}>Get detailed specs and information.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                </TouchableOpacity>

            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    content: {
        flex: 1,
        padding: 20,
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 3,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});
