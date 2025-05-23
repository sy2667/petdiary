// src/screens/SelectEmotionScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { emotionStyles } from './styles/SelectEmotion.styles'; // ✅ 스타일 import

type RootStackParamList = {
  SelectEmotion: {
    petId: number;
    date: string;
    name: string;
    emotion?: string;
    returnTo?: 'DiaryWrite';
  };
  DiaryWrite: {
    petId: number;
    date: string;
    name: string;
    emotion: string;
  };
};

const emotions = [
  { emoji: '😊', label: '행복' },
  { emoji: '😢', label: '슬픔' },
  { emoji: '😡', label: '화남' },
  { emoji: '😐', label: '무표정' },
  { emoji: '😍', label: '사랑스러움' },
  { emoji: '😴', label: '졸림' },
  { emoji: '🤒', label: '아픔' },
  { emoji: '😆', label: '신남' },
  { emoji: '😨', label: '불안' },
  { emoji: '😭', label: '눈물' },
  { emoji: '🤩', label: '반가움' },
  { emoji: '😋', label: '배부름' },
  { emoji: '🥱', label: '지침' },
  { emoji: '🤗', label: '안심' },
  { emoji: '😬', label: '불편' },
];

const SelectEmotionScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SelectEmotion'>>();
  const { petId, date, name, returnTo } = route.params;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSelect = (emotion: string) => {
    if (returnTo === 'DiaryWrite') {
      navigation.replace('DiaryWrite', {
        petId,
        date,
        name,
        emotion,
      });
    } else {
      navigation.navigate('DiaryWrite', {
        petId,
        date,
        name,
        emotion,
      });
    }
  };

  return (
    <View style={emotionStyles.container}>
      <Text style={emotionStyles.title}>{name}의 감정을 골라줘 😸</Text>
      <FlatList
        data={emotions}
        numColumns={3}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={emotionStyles.emotionBox}
            onPress={() => handleSelect(item.emoji)}
          >
            <Text style={emotionStyles.emoji}>{item.emoji}</Text>
            <Text style={emotionStyles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SelectEmotionScreen;
