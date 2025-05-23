// src/screens/PetListScreen.tsx
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { openDatabase } from '../db/database';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { petListStyles } from './styles/PetList.styles';
import Icon from 'react-native-vector-icons/Ionicons';

interface Pet {
  id: number;
  name: string;
  species: string;
  birthdate: string;
  profile_image_path: string;
}

type RootStackParamList = {
  PetList: undefined;
  AddPet: undefined;
  PetCalendar: { petId: number; name: string };
  Settings: undefined;
};

// ✅ 헤더에 넣을 설정 아이콘 버튼 컴포넌트
const SettingsButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={{ paddingRight: 15 }}>
    <Icon name="settings-outline" size={24} color="#333" />
  </TouchableOpacity>
);

const PetListScreen = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ✅ 뒤로가기 버튼 제거 + 설정 버튼 추가
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => <SettingsButton onPress={() => navigation.navigate('Settings')} />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchPets = async () => {
      const db = await openDatabase();
      const results = await db.executeSql('SELECT * FROM pets');
      const rows = results[0].rows;
      const petList: Pet[] = [];

      for (let i = 0; i < rows.length; i++) {
        petList.push(rows.item(i));
      }

      setPets(petList);
    };

    fetchPets();
  }, []);

  const renderItem = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={petListStyles.item}
      onPress={() =>
        navigation.navigate('PetCalendar', {
          petId: item.id,
          name: item.name,
        })
      }
    >
      <Image
        source={
          item.profile_image_path
            ? { uri: item.profile_image_path }
            : require('../assets/default_pet.png')
        }
        style={petListStyles.image}
      />
      <View style={petListStyles.textContainer}>
        <Text style={petListStyles.name}>{item.name}</Text>
        <Text style={petListStyles.info}>품종: {item.species}</Text>
        <Text style={petListStyles.info}>생일: {item.birthdate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={petListStyles.container}>
      <TouchableOpacity
        style={petListStyles.addButton}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Text style={petListStyles.addButtonText}>+ 우리아이 등록</Text>
      </TouchableOpacity>

      <Text style={petListStyles.title}>📋 등록된 우리아이 목록</Text>

      {pets.length === 0 ? (
        <View style={petListStyles.emptyContainer}>
          <Text style={petListStyles.emptyText}>아직 등록된 우리아이가 없어요 😢</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default PetListScreen;
