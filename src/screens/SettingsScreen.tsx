// src/screens/SettingsScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getSettingsStyles } from './styles/SettingsScreen.styles'; // 💡 함수형 스타일
import { ThemeContext } from '../theme/ThemeContext'; // 💡 테마 컨텍스트

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const { theme } = useContext(ThemeContext); // 현재 테마 가져오기
  const settingsStyles = getSettingsStyles(theme); // 테마 기반 스타일 사용

  const toggleAlarm = () => {
    setIsAlarmEnabled((prev) => !prev);
  };

  return (
    <View style={settingsStyles.container}>
      {/* ⬅️ Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={settingsStyles.backButton}>
        <Icon name="chevron-back" size={26} style={settingsStyles.icon} />
      </TouchableOpacity>

      {/* 메뉴 시작 */}
      <View style={settingsStyles.item}>
        <Icon name="notifications-outline" size={20} style={settingsStyles.icon} />
        <Text style={settingsStyles.text}>일기 알림</Text>
        <Switch
          value={isAlarmEnabled}
          onValueChange={toggleAlarm}
          style={{ marginLeft: 'auto' }}
        />
      </View>

      {isAlarmEnabled && (
        <TouchableOpacity
          style={settingsStyles.item}
          onPress={() => Alert.alert('알림 시간 값은 등록중입니다.')}
        >
          <Icon name="time-outline" size={20} style={settingsStyles.icon} />
          <Text style={[settingsStyles.text, { marginLeft: 3 }]}>알림 시간</Text>
          <Text style={[settingsStyles.text, { marginLeft: 'auto', opacity: 0.7 }]}>오후 10:00</Text>
        </TouchableOpacity>
      )}

      <View style={settingsStyles.item}>
        <Icon name="color-palette-outline" size={20} style={settingsStyles.icon} />
        <Text style={settingsStyles.text}>테마 설정</Text>
      </View>

      <View style={settingsStyles.item}>
        <Icon name="text-outline" size={20} style={settingsStyles.icon} />
        <Text style={settingsStyles.text}>글자 스타일</Text>
      </View>

      <View style={settingsStyles.divider} />

      <View style={settingsStyles.item}>
        <Icon name="cloud-upload-outline" size={20} style={settingsStyles.icon} />
        <Text style={settingsStyles.text}>백업/복원 (Google Drive)</Text>
      </View>

      <View style={settingsStyles.item}>
        <Icon name="document-text-outline" size={20} style={settingsStyles.icon} />
        <Text style={settingsStyles.text}>PDF 내보내기</Text>
      </View>

      <View style={settingsStyles.item}>
        <Icon name="language-outline" size={20} style={settingsStyles.icon} />
        <Text style={settingsStyles.text}>언어 설정</Text>
      </View>

      <View style={settingsStyles.item}>
        <Icon name="happy-outline" size={20} style={settingsStyles.icon} />
        <Text style={settingsStyles.text}>앱 평가하기</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;
