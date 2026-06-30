import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth, AuthProvider } from '../helpers/AuthContext'; // Fix import path
import { Home, Scan, History, User } from 'lucide-react-native';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { AnalyticsScreen } from '../screens/dashboard/AnalyticsScreen';
import { ScanScreen } from '../screens/scan/ScanScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TabBarIcon } from '../components/layout/TabBarIcon';
import { colors } from '../theme/colors';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { useTheme } from '../context/ThemeContext';

import { ScanResultScreen } from '../screens/scan/ScanResultScreen';

const ScanStack = createNativeStackNavigator();

function ScanNavigator() {
    return (
        <ScanStack.Navigator screenOptions={{ headerShown: false }}>
            <ScanStack.Screen name="ScanScreen" component={ScanScreen} options={{ headerShown: false }} />
            <ScanStack.Screen name="ScanResult" component={ScanResultScreen} options={{ headerShown: true, title: 'Results' }} />
        </ScanStack.Navigator>
    );
}

import { SettingsScreen } from '../screens/settings/SettingsScreen';

import { SubscriptionScreen } from '../screens/subscription/SubscriptionScreen';
import { CancellationScreen } from '../screens/subscription/CancellationScreen';
import { RefundScreen } from '../screens/subscription/RefundScreen';
import { EditProfileScreen } from '../screens/settings/account/EditProfileScreen';
import { SecuritySettingsScreen } from '../screens/settings/privacy/SecuritySettingsScreen';
import { ScanSettingsScreen } from '../screens/settings/scan/ScanSettingsScreen';
import { NotificationSettingsScreen } from '../screens/settings/preferences/NotificationSettingsScreen';
import { LegalScreen } from '../screens/settings/legal/LegalScreen';
import { HelpCenterScreen } from '../screens/settings/support/HelpCenterScreen';
import { ContactSupportScreen } from '../screens/settings/support/ContactSupportScreen';

const ProfileStack = createNativeStackNavigator();

function ProfileNavigator() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
            <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />

            {/* Subscription & Payment */}
            <ProfileStack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: true, title: 'Manage Subscription' }} />
            <ProfileStack.Screen name="Cancellation" component={CancellationScreen} options={{ headerShown: true, title: 'Cancel Subscription' }} />
            <ProfileStack.Screen name="Refund" component={RefundScreen} options={{ headerShown: true, title: 'Request Refund' }} />

            {/* Functional Settings */}
            <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: 'Edit Profile' }} />
            <ProfileStack.Screen name="SecuritySettings" component={SecuritySettingsScreen} options={{ headerShown: true, title: 'Security & Privacy' }} />
            <ProfileStack.Screen name="ScanSettings" component={ScanSettingsScreen} options={{ headerShown: true, title: 'Scan Preferences' }} />
            <ProfileStack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ headerShown: true, title: 'Notifications' }} />
            <ProfileStack.Screen name="Legal" component={LegalScreen} options={{ headerShown: true, title: 'Legal & About' }} />

            {/* Help & Support */}
            <ProfileStack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ headerShown: true, title: 'Help Center' }} />
            <ProfileStack.Screen name="ContactSupport" component={ContactSupportScreen} options={{ headerShown: true, title: 'Contact Support' }} />
        </ProfileStack.Navigator>
    );
}

import { useSettingsSync } from '../hooks/useSettingsSync';

const DashboardStack = createNativeStackNavigator();

function DashboardNavigator() {
    return (
        <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
            <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} />
            <DashboardStack.Screen name="Analytics" component={AnalyticsScreen} options={{ headerShown: true, title: 'Analytics' }} />
        </DashboardStack.Navigator>
    );
}

function MainNavigator() {
    const { colors, isDark } = useTheme();
    useSettingsSync(); // Sync settings on load

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                }
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon icon={Home} color={color} />
                }}
            />
            <Tab.Screen
                name="ScanTab"
                component={ScanNavigator}
                options={{
                    title: 'Scan',
                    tabBarIcon: ({ color }) => <TabBarIcon icon={Scan} color={color} />
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon icon={History} color={color} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon icon={User} color={color} />
                }}
            />
        </Tab.Navigator>
    );
}

import { ThemeSelectionScreen } from '../screens/auth/ThemeSelectionScreen';

function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ThemeSelection" component={ThemeSelectionScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
}

function RootNavigator() {
    const { session, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {session ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

export const AppNavigator = () => {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
};
