import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../theme/colors';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    colors: typeof lightColors;
    isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
    themeMode: 'system',
    setThemeMode: () => { },
    colors: lightColors,
    isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

    useEffect(() => {
        // Load saved theme preference on mount
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('user_theme_preference');
                if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
                    setThemeModeState(savedTheme);
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
            }
        };
        loadTheme();
    }, []);

    const setThemeMode = async (mode: ThemeMode) => {
        setThemeModeState(mode);
        try {
            await AsyncStorage.setItem('user_theme_preference', mode);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const isDark = themeMode === 'system'
        ? systemScheme === 'dark'
        : themeMode === 'dark';

    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode, colors, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
