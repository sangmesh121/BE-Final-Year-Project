import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';

interface ProfileSummaryCardProps {
    name: string;
    email: string;
    avatar?: string;
    isPremium?: boolean;
    onEditPress: () => void;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
    name, email, avatar, isPremium, onEditPress
}) => {
    const { colors, isDark } = useTheme();

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: isDark ? 1 : 0
            }
        ]}>
            <View style={styles.content}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.border }]}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                        <FontAwesome5 name="user" size={30} color={colors.textSecondary} />
                    )}
                    {isPremium && (
                        <View style={styles.badge}>
                            <FontAwesome5 name="crown" size={10} color="#fff" />
                        </View>
                    )}
                </View>

                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
                    <Text style={[styles.email, { color: colors.textSecondary }]}>{email}</Text>

                    <View style={[styles.planBadge, { backgroundColor: isPremium ? '#6200ee20' : '#eee' }]}>
                        <Text style={[styles.planText, { color: isPremium ? '#6200ee' : '#666' }]}>
                            {isPremium ? 'Premium Plan' : 'Free Plan'}
                        </Text>
                    </View>
                </View>
            </View>

            <Button
                title="Edit Profile"
                variant="outline"
                size="small"
                onPress={onEditPress}
                style={{ marginTop: spacing.m }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: spacing.l,
        borderRadius: 16,
        marginBottom: spacing.l,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
        position: 'relative',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    badge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFD700',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        marginBottom: 8,
    },
    planBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    planText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});
