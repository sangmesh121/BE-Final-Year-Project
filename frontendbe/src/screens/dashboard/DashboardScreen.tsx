import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container } from '../../components/Container';
import { useAuth } from '../../helpers/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

// Components
import { ActionCard } from '../../components/dashboard/ActionCard';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { FontAwesome5 } from '@expo/vector-icons';
import { SupabaseService } from '../../services/SupabaseService';

export const DashboardScreen = ({ navigation }: any) => {
    const { user } = useAuth();
    const { colors, themeMode } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [scanPref, setScanPref] = useState('Verify');
    const [stats, setStats] = useState<{total: number, verified: number, issues: number, verifiedList: any[], issuesList: any[], recentScans: any[]}>({ total: 0, verified: 0, issues: 0, verifiedList: [], issuesList: [], recentScans: [] });

    const loadStats = async () => {
        if (!user) return;
        try {
            const data = await SupabaseService.getDashboardStats(user.id);
            setStats(data);
            const savedPref = await AsyncStorage.getItem('scan_preference');
            if (savedPref) setScanPref(savedPref);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [user])
    );

    const statsData = [
        { label: 'Total Scans', value: stats.total.toString(), accentColor: colors.primary },
        { label: 'Verified', value: stats.verified.toString(), accentColor: '#4CAF50' },
        { label: 'Issues', value: stats.issues.toString(), accentColor: '#F44336' },
    ];

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadStats();
        setRefreshing(false);
    }, [user]);

    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.text }]}>
                            Hello, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Welcome back
                        </Text>
                    </View>
                    <View style={[styles.avatar, { backgroundColor: colors.border }]}>
                        <FontAwesome5 name="user" size={20} color={colors.textSecondary} />
                    </View>
                </View>

                {/* Quick Stats */}
                <QuickStats 
                    stats={statsData} 
                    onPressStat={(stat) => navigation.navigate('Analytics', { stats: statsData, selectedRef: stat.label, rawStats: stats })}
                />

                {/* Primary Actions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
                    {scanPref === 'Price' ? (
                        <ActionCard
                            title="Check Price"
                            subtitle="Find best deals instantly"
                            icon="tag"
                            color={colors.primary}
                            onPress={() => navigation.navigate('ScanTab', { screen: 'ScanScreen', params: { intent: 'price' } })}
                        />
                    ) : scanPref === 'Details' ? (
                        <ActionCard
                            title="Product Details"
                            subtitle="Identify product info instantly"
                            icon="info-circle"
                            color={colors.primary}
                            onPress={() => navigation.navigate('ScanTab', { screen: 'ScanScreen', params: { intent: 'details' } })}
                        />
                    ) : (
                        <ActionCard
                            title="Verify Authenticity"
                            subtitle="Check product authenticity instantly"
                            icon="camera"
                            color={colors.primary}
                            onPress={() => navigation.navigate('ScanTab', { screen: 'ScanScreen', params: { intent: 'verify' } })}
                        />
                    )}
                    
                    <ActionCard
                        title="Upload Image"
                        subtitle="Check from your gallery"
                        icon="image"
                        color={colors.secondary}
                        onPress={() => navigation.navigate('ScanTab', { screen: 'ScanScreen', params: { mode: 'upload' } })}
                    />
                    <ActionCard
                        title="Check Website"
                        subtitle="Verify URL safety"
                        icon="globe"
                        color="#FF9800"
                        onPress={() => navigation.navigate('ScanTab', { screen: 'ScanScreen', params: { mode: 'url' } })}
                    />
                </View>

                {/* Recent Activity */}
                <RecentActivity recentScans={stats.recentScans} />

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
        marginTop: spacing.s,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: spacing.l,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
});
