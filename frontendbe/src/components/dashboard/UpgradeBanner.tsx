import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

export const UpgradeBanner = ({ onPress }: { onPress: () => void }) => {
    return (
        <LinearGradient
            colors={['#6200ee', '#3700b3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="crown" size={24} color="#ffd700" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Upgrade to Premium</Text>
                    <Text style={styles.subtitle}>Get unlimited scans and detailed analytics.</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>Upgrade Now</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: spacing.l,
        marginBottom: spacing.l,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: spacing.s,
        alignItems: 'center',
    },
    buttonText: {
        color: '#6200ee',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
