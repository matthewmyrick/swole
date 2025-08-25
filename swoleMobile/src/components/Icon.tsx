import React from 'react';
import { Text, TextStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

const iconMap: { [key: string]: string } = {
  // Navigation icons
  'calendar-outline': '📅',
  'fitness-outline': '💪',
  
  // General icons
  'arrow-back': '←',
  'chevron-forward': '›',
  'add': '+',
  'play': '▶',
  'checkmark': '✓',
  'checkmark-circle': '✓',
  'alert-circle': '⚠',
  'create-outline': '✏',
  'trending-up': '📈',
  
  // Day icons
  'partly-sunny': '🌤',
  'barbell': '🏋',
  'fitness': '💪',
  'bicycle': '🚴',
  'trophy': '🏆',
  'basketball': '🏀',
  'bed': '🛏',
  'moon': '🌙',
  'calendar': '📅',
  
  // Workout type icons
  'people': '👥',
  'walk': '🚶',
  'body': '👤',
  'footsteps': '👣',
  
  // Detail icons
  'barbell-outline': '🏋',
  'time-outline': '⏱',
  'repeat-outline': '🔄',
  'fitness-outline': '💪',
};

const Icon: React.FC<IconProps> = ({ name, size = 16, color, style }) => {
  const iconSymbol = iconMap[name] || '•';
  
  return (
    <Text 
      style={[
        {
          fontSize: size,
          color: color,
          textAlign: 'center',
          lineHeight: size * 1.2,
        },
        style
      ]}
    >
      {iconSymbol}
    </Text>
  );
};

export default Icon;