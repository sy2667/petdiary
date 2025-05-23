// App.tsx
import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import AddPetScreen from './src/pages/AddPetScreen';
import PetListScreen from './src/pages/PetListScreen';
import PetCalendarScreen from './src/pages/PetCalendarScreen';
import SelectEmotionScreen from './src/pages/SelectEmotionScreen';
import DiaryWriteScreen from './src/pages/DiaryWriteScreen';
import SettingsScreen from './src/pages/SettingsScreen';

import { initDatabase } from './src/db/database';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext'; // ✅ 테마 context

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="PetList">
        <Stack.Screen
          name="PetList"
          component={PetListScreen}
          options={{ title: '', headerLeft: () => null }}
        />
        <Stack.Screen
          name="AddPet"
          component={AddPetScreen}
          options={{ title: '등록하기' }}
        />
        <Stack.Screen
          name="PetCalendar"
          component={PetCalendarScreen}
          options={{ title: '일기 캘린더' }}
        />
        <Stack.Screen
          name="SelectEmotion"
          component={SelectEmotionScreen}
          options={{ title: '감정 선택' }}
        />
        <Stack.Screen
          name="DiaryWrite"
          component={DiaryWriteScreen}
          options={{ title: '일기 작성' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: '설정' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      setIsReady(true);
    };
    setup();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
