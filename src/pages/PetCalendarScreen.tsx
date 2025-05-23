// src/screens/PetCalendarScreen.tsx
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
  RouteProp,
} from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { openDatabase } from '../db/database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { petCalendarStyles } from '../styles/PetCalendar.styles';

// ✅ 아이콘 import 추가
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  PetList: undefined;
  PetCalendar: { petId: number; name: string };
  SelectEmotion: { petId: number; date: string; name: string };
  DiaryWrite: {
    petId: number;
    name: string;
    date: string;
    emotion: string;
    title: string;
    content: string;
    image_path?: string;
  };
};

type DiaryEntry = {
  id: number;
  date: string;
  title: string;
  content: string;
  emotion: string;
  image_path: string;
};

const PetCalendarScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PetCalendar'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { petId, name } = route.params;

  const [diaryDates, setDiaryDates] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);

  const todayStringRef = useRef(new Date().toISOString().split('T')[0]);

  // ✅ 상단 뒤로가기 아이콘
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('PetList')}
          style={{ paddingHorizontal: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // ✅ 하드웨어 뒤로가기 버튼
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('PetList');
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation])
  );

  const fetchDiaryDates = useCallback(async () => {
    const db = await openDatabase();
    const results = await db.executeSql(
      `SELECT date FROM diary_entries WHERE pet_id = ?`,
      [petId]
    );

    const dates: Record<string, any> = {};
    const rows = results[0].rows;

    for (let i = 0; i < rows.length; i++) {
      const date = rows.item(i).date;
      dates[date] = {
        marked: true,
        dotColor: '#4a90e2',
      };
    }

    setDiaryDates(dates);
  }, [petId]);

  const fetchDiaryByDate = useCallback(async (date: string) => {
    const db = await openDatabase();
    const results = await db.executeSql(
      `SELECT * FROM diary_entries WHERE pet_id = ? AND date = ?`,
      [petId, date]
    );

    const rows = results[0].rows;
    if (rows.length > 0) {
      const diary = rows.item(0);
      setSelectedDiary(diary);
    } else {
      setSelectedDiary(null);
    }
  }, [petId]);

  useEffect(() => {
    const initialize = async () => {
      await fetchDiaryDates();
      setSelectedDate(todayStringRef.current);
      await fetchDiaryByDate(todayStringRef.current);
    };
    initialize();
  }, [fetchDiaryDates, fetchDiaryByDate]);

  const handleDayPress = (day: DateData) => {
    const selected = day.dateString;
    setSelectedDate(selected);
    fetchDiaryByDate(selected);
  };

  const handleWriteDiary = () => {
    if (selectedDate) {
      navigation.navigate('SelectEmotion', {
        petId,
        date: selectedDate,
        name,
      });
    }
  };

  const handleEditDiary = () => {
    if (!selectedDiary || !selectedDate) return;

    navigation.navigate('DiaryWrite', {
      petId,
      name,
      date: selectedDate,
      emotion: selectedDiary.emotion,
      title: selectedDiary.title,
      content: selectedDiary.content,
      image_path: selectedDiary.image_path,
    });
  };

  return (
    <ScrollView style={petCalendarStyles.container}>
      <Text style={petCalendarStyles.title}>📅 {name}의 일기 캘린더</Text>

      <Calendar
        markedDates={{
          ...diaryDates,
          ...(selectedDate && diaryDates[selectedDate]
            ? {
                [selectedDate]: {
                  ...(diaryDates[selectedDate] || {}),
                  selected: true,
                  selectedColor: '#4a90e2',
                },
              }
            : {}),
        }}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: '#4a90e2',
          todayTextColor: '#4a90e2',
          arrowColor: '#4a90e2',
        }}
      />

      {selectedDate && (
        <View style={petCalendarStyles.detailBox}>
          <Text style={petCalendarStyles.dateText}>📌 {selectedDate}</Text>

          {selectedDiary ? (
            <TouchableOpacity onPress={handleEditDiary}>
              <Text style={petCalendarStyles.emotion}>
                감정: <Text style={petCalendarStyles.emoji}>{selectedDiary.emotion}</Text>
              </Text>
              <Text style={petCalendarStyles.titleText}>{selectedDiary.title}</Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={petCalendarStyles.contentText}
              >
                {selectedDiary.content}
              </Text>
              {selectedDiary.image_path ? (
                <View style={petCalendarStyles.imageContainer}>
                  {selectedDiary.image_path.split(',').map((uri, idx, arr) => (
                    <Image
                      key={idx}
                      source={{ uri }}
                      style={
                        arr.length === 1
                          ? petCalendarStyles.fullImage
                          : petCalendarStyles.halfImage
                      }
                    />
                  ))}
                </View>
              ) : null}
            </TouchableOpacity>
          ) : (
            <Button
              title="✏️ 일기 쓰기"
              onPress={handleWriteDiary}
              color="#4a90e2"
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default PetCalendarScreen;
