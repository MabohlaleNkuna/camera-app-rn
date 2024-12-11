import * as SQLite from "expo-sqlite";

export const initialiseDb = async () => {
  const db = await SQLite.openDatabase("ImageGalleryAppToo");

  const init = await db.transactionAsync(async () => {
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY NOT NULL, fileId TEXT NOT NULL, filename TEXT NOT NULL, uri TEXT NOT NULL, timestamp TEXT NOT NULL, lat REAL NOT NULL, long REAL NOT NULL)"
    );
  });
};

export const createTable = async () => {
  const db = await SQLite.openDatabase("ImageGalleryAppToo");

  await db.transactionAsync(async () => {
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY NOT NULL, fileId TEXT NOT NULL, filename TEXT NOT NULL, uri TEXT NOT NULL, timestamp TEXT NOT NULL, lat REAL NOT NULL, long REAL NOT NULL)"
    );
  });
};

export const insertData = async (fileId, filename, uri, timestamp, lat, long) => {
  const db = await SQLite.openDatabase("ImageGalleryAppToo");

  const insert = await db.transactionAsync(async () => {
    await db.runAsync(
      "INSERT INTO images (fileId, filename, uri, timestamp, lat, long) VALUES (?, ?, ?, ?, ?, ?)",
      [fileId, filename, uri, timestamp, lat, long]
    );
  });
  return insert;
};

export const readData = async () => {
  const db = await SQLite.openDatabase("ImageGalleryAppToo");

  const res = await db.getAllAsync("SELECT * FROM images");
  return res;
};

export const deleteData = async (id) => {
  const db = await SQLite.openDatabase("ImageGalleryAppToo");

  const data = await db.transactionAsync(async () => {
    await db.execAsync("DELETE FROM images WHERE id = ?", [id]);
  });
  return data;
};
