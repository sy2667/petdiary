// src/db/database.ts
// @ts-ignore
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

// 🔒 싱글턴 DB 인스턴스 (한 번만 열어서 재사용)
let dbInstance: SQLite.SQLiteDatabase | null = null;

// ✅ DB 열기
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) return dbInstance;

  dbInstance = await SQLite.openDatabase({
    name: 'petdiary.db',
    location: 'default',
  });

  return dbInstance;
};

// ✅ DB 닫기
export const closeDatabase = async () => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    console.log('📕 DB 닫힘');
  }
};

// ✅ DB 삭제 (닫고 → 삭제)
export const resetDatabase = async () => {
  try {
    // 1. 연결된 DB가 있으면 닫기
    if (dbInstance) {
      await dbInstance.close(); // ✅ DB 닫기
      dbInstance = null;
      console.log('📕 DB 닫힘');
    }

    // 2. 삭제 전에 이미 열린 DB가 있으면 SQLite에서 거절함
    await SQLite.deleteDatabase({
      name: 'petdiary.db',
      location: 'default',
    });
    console.log('💣 DB 삭제 완료!');

    // 3. 삭제 후, 다시 열기
    await openDatabase();
    console.log('📗 DB 다시 열림');
  } catch (error) {
    console.error('❌ DB 삭제 중 에러:', error);
  }
};

// ✅ DB 초기화 (테이블 생성)
export const initDatabase = async () => {
  const db = await openDatabase();

  // 🐶 반려동물 테이블
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      species TEXT,
      birthdate TEXT,
      profile_image_path TEXT
    )
  `);

  // 📔 일기 테이블
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS diary_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id INTEGER,
      date TEXT,
      title TEXT,
      content TEXT,
      image_path TEXT,
      emotion TEXT,
      activities TEXT,
      created_at TEXT,
      updated_at TEXT
    )
  `);

  console.log('✅ 테이블 초기화 완료!');
};

// ✅ 반려동물 등록
export const insertPet = async (
  name: string,
  species: string,
  birthdate: string,
  profileImagePath: string
) => {
  const db = await openDatabase();
  await db.executeSql(
    `INSERT INTO pets (name, species, birthdate, profile_image_path) VALUES (?, ?, ?, ?)`,
    [name, species, birthdate, profileImagePath]
  );
  console.log('🐾 반려동물 저장 완료');
};

// ✅ 일기 저장
export const insertDiary = async (
  petId: number,
  date: string,
  title: string,
  content: string,
  emotion: string
) => {
  const db = await openDatabase();
  await db.executeSql(
    `INSERT INTO diary_entries 
     (pet_id, date, title, content, image_path, emotion, activities, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      petId,
      date,
      title,
      content,
      '', // image_path (추후 이미지 경로 저장용)
      emotion,
      '', // activities (추후 체크박스 저장용)
      new Date().toISOString(),
    ]
  );
  console.log('📝 일기 저장 완료!');
};

// src/db/database.ts
export const upsertDiary = async (
  petId: number,
  date: string,
  title: string,
  content: string,
  emotion: string,
  imagePath: string
) => {
  const db = await openDatabase();
  const result = await db.executeSql(
    `SELECT * FROM diary_entries WHERE pet_id = ? AND date = ?`,
    [petId, date]
  );

  if (result[0].rows.length > 0) {
    await db.executeSql(
      `UPDATE diary_entries
       SET title = ?, content = ?, emotion = ?, image_path = ?, updated_at = ?
       WHERE pet_id = ? AND date = ?`,
      [title, content, emotion, imagePath, new Date().toISOString(), petId, date]
    );
  } else {
    await db.executeSql(
      `INSERT INTO diary_entries (pet_id, date, title, content, emotion, image_path, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [petId, date, title, content, emotion, imagePath, new Date().toISOString()]
    );
  }
};