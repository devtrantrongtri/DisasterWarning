// src/utils/indexedDB.ts
import { openDB } from 'idb';

const DB_NAME = 'WeatherDatabase';
const STORE_NAME = 'Provinces';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const addProvince = async (provinceData: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, provinceData);
};

export const getProvinces = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const deleteProvince = async (id: number) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
