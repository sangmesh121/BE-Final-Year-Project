import { useEffect } from 'react';
import { useAuth } from '../helpers/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SupabaseService } from '../services/SupabaseService';

export const useSettingsSync = () => {
    const { user } = useAuth();
    const { setThemeMode } = useTheme();

    useEffect(() => {
        if (!user) return;

        const syncSettings = async () => {
            try {
                // Ensure profile, settings, and subscription records exist in database
                await SupabaseService.ensureUserProfile(user);

                // Fetch settings from Supabase
                const settings = await SupabaseService.getUserSettings(user.id);
                if (settings) {
                    // Sync Theme
                    if (settings.theme && ['light', 'dark', 'system'].includes(settings.theme)) {
                        setThemeMode(settings.theme);
                    }

                    // Future: Sync other settings like Default Intent, Notifications, etc.
                    // This requires a global SettingsContext or similar.
                } else {
                    // If no settings exist (edge case), create them?
                    // The trigger should have handled this, but we can verify.
                }
            } catch (error) {
                console.warn('Failed to sync settings:', error);
            }
        };

        syncSettings();
    }, [user?.id]);
};
