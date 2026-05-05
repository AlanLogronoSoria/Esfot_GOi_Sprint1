import React from 'react';
import { TextInput as RNInput, StyleSheet, Text, TextInputProps, View } from 'react-native';

type Props = TextInputProps & { label?: string; error?: string };

export const TextInput: React.FC<Props> = ({ label, error, style, ...rest }) => {
  return (
    <View style={s.container}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <RNInput style={[s.input, style]} placeholderTextColor="#999" {...rest} />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
};

const s = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { marginBottom: 6, color: '#222' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  error: { color: '#c00', marginTop: 4 },
});

export default TextInput;
