import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { spacing } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';

interface ContainerProps extends ViewProps {
    children: React.ReactNode;
    centered?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ children, centered, style, ...props }) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.background },
                centered && styles.centered,
                style
            ]}
            {...props}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
