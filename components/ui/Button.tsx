import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

type Props = { title: string; onPress?: () => void; style?: ViewStyle; disabled?: boolean };

export const Button: React.FC<Props> = ({ title, onPress, style, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[s.button, style]} disabled={disabled}>
      <Text style={s.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  button: {
    backgroundColor: '#c8102e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: { color: '#fff', fontWeight: '600' },
});

export default Button;
