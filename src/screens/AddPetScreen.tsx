// src/screens/AddPetScreen.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { insertPet } from '../db/database';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import { addPetStyles } from './styles/AddPet.styles'; // ✅ 스타일 import

const AddPetScreen = () => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [birthdate, setBirthdate] = useState<Date>(new Date());
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const handleSave = async () => {
    if (!name || !species || !birthdate) {
      Alert.alert('모든 항목을 입력해줘!');
      return;
    }

    const dateStr = birthdate.toISOString().split('T')[0];
    await insertPet(name, species, dateStr, profileImage || '');
    Alert.alert('반려동물이 저장됐어! 🐾');

    setName('');
    setSpecies('');
    setBirthdate(new Date());
    setProfileImage(null);

    navigation.navigate('PetList' as never);
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });

    if (result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri || null);
    }
  };

  return (
    <View style={addPetStyles.container}>
      <Text style={addPetStyles.title}>🐾 반려동물 등록</Text>

      <TouchableOpacity onPress={handleSelectImage} style={addPetStyles.imagePicker}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={addPetStyles.image} />
        ) : (
          <Text style={addPetStyles.imageText}>+ 사진 선택</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="이름"
        style={addPetStyles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="품종"
        style={addPetStyles.input}
        value={species}
        onChangeText={setSpecies}
      />

      <TouchableOpacity style={addPetStyles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: '#000' }}>
          생일: {birthdate.toISOString().split('T')[0]}
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={showDatePicker}
        date={birthdate}
        mode="date"
        onConfirm={(date) => {
          setShowDatePicker(false);
          setBirthdate(date);
        }}
        onCancel={() => setShowDatePicker(false)}
        theme="light"
        confirmText="확인"
        cancelText="취소"
        title="생일 선택"
      />

      <Button title="등록하기" color="#4a90e2" onPress={handleSave} />
    </View>
  );
};

export default AddPetScreen;
