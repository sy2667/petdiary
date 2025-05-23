import { StyleSheet } from 'react-native';

const diaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emotion: {
    fontSize: 16,
    marginBottom: 20,
  },
  emoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  diaryInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    height: 140,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  imageUploadBox: {
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  imagePreviewBox: {
    marginRight: 10,
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteText: {
    fontSize: 12,
    color: '#f00',
    fontWeight: 'bold',
    lineHeight: 14,
  },
});

export default diaryStyles;
