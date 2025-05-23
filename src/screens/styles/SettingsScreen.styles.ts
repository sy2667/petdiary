// src/screens/styles/SettingsScreen.styles.ts
import { StyleSheet } from 'react-native';

export const getSettingsStyles = (theme: 'light' | 'dark') => {
  const isDark = theme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111' : '#fff',
      padding: 20,
      paddingTop: 60,
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 10,
      zIndex: 10,
      padding: 10,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 8,
    },
    text: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
    icon: {
      marginRight: 14,
      color: isDark ? '#fff' : '#000', // 아이콘 색상도 반영
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? '#333' : '#ccc',
      marginVertical: 16,
    },
  });
};
