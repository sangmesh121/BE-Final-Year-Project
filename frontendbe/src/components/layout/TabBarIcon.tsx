import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface TabBarIconProps {
    icon: LucideIcon;
    color: string;
    size?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ icon: Icon, color, size = 24 }) => {
    return <Icon color={color} size={size} />;
};
