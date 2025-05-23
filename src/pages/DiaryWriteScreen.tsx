// src/screens/DiaryWriteScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'react-native-image-picker';
import { upsertDiary } from '../db/database';
import diaryStyles from '../styles/DiaryWrite.styles';

type RootStackParamList = {
  DiaryWrite: {
    petId: number;
    date: string;
    name: string;
    emotion: string;
    title?: string;
    content?: string;
    image_path?: string;
  };
  PetCalendar: {
    petId: number;
    name: string;
  };
  SelectEmotion: {
    petId: number;
    date: string;
    name: string;
    emotion: string;
    returnTo: 'DiaryWrite';
  };
};

const DiaryWriteScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DiaryWrite'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    petId,
    date,
    name,
    emotion,
    title: initTitle = '',
    content: initContent = '',
    image_path = '',
  } = route.params;

  const [title, setTitle] = useState(initTitle);
  const [content, setContent] = useState(initContent);
  const [images, setImages] = useState<string[]>(image_path ? image_path.split(',') : []);

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('제목과 내용을 모두 입력해줘!');
      return;
    }

    await upsertDiary(
      petId,
      date,
      title,
      content,
      emotion,
      images.filter(Boolean).join(',')
    );

    Alert.alert('일기가 저장됐어! 🐾');
    navigation.navigate('PetCalendar', {
      petId,
      name,
    });
  };

  const handleEditEmotion = () => {
    navigation.navigate('SelectEmotion', {
      petId,
      date,
      name,
      emotion,
      returnTo: 'DiaryWrite',
    });
  };

  const requestImagePermission = async () => {
    if (Platform.OS !== 'android') return true;

    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.request(permission, {
      title: '사진 접근 권한',
      message: '사진을 선택하려면 접근 권한이 필요해!',
      buttonPositive: '확인',
    });

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handleAddImage = async () => {
    const hasPermission = await requestImagePermission();
    if (!hasPermission) {
      Alert.alert('권한 거부됨', '사진을 선택하려면 권한이 필요해!');
      return;
    }

    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 2,
    });

    if (result.assets) {
      const selected = result.assets.map((asset) => asset.uri!).slice(0, 2);
      const combined = [...images, ...selected].slice(0, 2);
      setImages(combined);
    }
  };

  return (
    <View style={diaryStyles.container}>
      <Text style={diaryStyles.title}>🐾 {name}의 {date} 일기</Text>

      <TouchableOpacity onPress={handleEditEmotion}>
        <Text style={diaryStyles.emotion}>
          기분: <Text style={diaryStyles.emoji}>{emotion}</Text>
        </Text>
      </TouchableOpacity>

      <Text style={diaryStyles.sectionTitle}>📌 오늘의 제목</Text>
      <TextInput
        placeholder="예: 간식 많이 먹은 날 🍪"
        value={title}
        onChangeText={setTitle}
        style={diaryStyles.titleInput}
      />

      <View style={diaryStyles.separator} />

      <Text style={diaryStyles.sectionTitle}>📝 오늘의 일기</Text>
      <TextInput
        multiline
        placeholder="오늘 있었던 일들을 자유롭게 적어줘!"
        value={content}
        onChangeText={setContent}
        style={diaryStyles.diaryInput}
      />

      <TouchableOpacity onPress={handleAddImage} style={diaryStyles.imageUploadBox}>
        <Text style={{ color: '#888' }}>📷 사진 추가</Text>
      </TouchableOpacity>

      <View style={diaryStyles.imageRow}>
        {images.map((uri, idx) => (
          <View key={idx} style={diaryStyles.imagePreviewBox}>
            <Image source={{ uri }} style={diaryStyles.previewImage} />
            <TouchableOpacity
              style={diaryStyles.deleteButton}
              onPress={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
            >
              <Text style={diaryStyles.deleteText}>✖</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="저장하기" onPress={handleSave} color="#4a90e2" />
      </View>
    </View>
  );
};

export default DiaryWriteScreen;
