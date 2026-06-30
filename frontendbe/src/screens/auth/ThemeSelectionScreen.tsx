import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSelectionScreen = ({ navigation }: any) => {
    const { setThemeMode, colors, themeMode } = useTheme();

    const handleSelect = (mode: 'light' | 'dark' | 'system') => {
        setThemeMode(mode);
    };

    const handleContinue = () => {
        navigation.navigate('Login');
    };

    const Option = ({ mode, label }: { mode: 'light' | 'dark' | 'system', label: string }) => {
        const isSelected = themeMode === mode;
        return (
            <TouchableOpacity
                style={[
                    styles.option,
                    {
                        backgroundColor: colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border,
                        borderWidth: isSelected ? 2 : 1
                    }
                ]}
                onPress={() => handleSelect(mode)}
            >
                <Text style={[styles.optionText, { color: colors.text, fontWeight: isSelected ? 'bold' : 'normal' }]}>
                    {label}
                </Text>
                {isSelected && <View style={[styles.indicator, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
        );
    };

    return (
        <Container centered>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text style={[styles.title, { color: colors.primary }]}>Choose Appearance</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Select your preferred display mode. You can change this later in settings.
                </Text>

                <View style={styles.optionsContainer}>
                    <Option mode="light" label="Light Mode" />
                    <Option mode="dark" label="Dark Mode" />
                    <Option mode="system" label="System Default" />
                </View>

                <Button
                    title="Continue"
                    onPress={handleContinue}
                    style={{ marginTop: 20 }}
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
        elevation: 5,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    optionsContainer: {
        gap: 15,
    },
    option: {
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    optionText: {
        fontSize: 18,
    },
    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
