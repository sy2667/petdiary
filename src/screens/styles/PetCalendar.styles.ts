// src/styles/PetCalendar.styles.ts
import { StyleSheet } from 'react-native';

export const petCalendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emotion: {
    fontSize: 14,
    marginBottom: 6,
  },
  emoji: {
    fontSize: 20,
    marginLeft: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8, // 이미지랑 간격을 주기 위해 추가
  },

  // ✅ 이미지 관련 스타일 추가
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  fullImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  halfImage: {
    width: '48%',
    height: 100,
    borderRadius: 10,
  },
});
