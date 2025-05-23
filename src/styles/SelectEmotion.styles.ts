// src/screens/styles/SelectEmotion.styles.ts
import { StyleSheet } from 'react-native';

export const emotionStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  emotionBox: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f4ff',
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
  },
});
