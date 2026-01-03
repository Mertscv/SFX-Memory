import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface Sound {
    id: string;
    fileName: string;
    file: Blob;
    name: string;
    category?: string;
    duration: number;
    tags: string[];
    notes: string;
    createdAt: number;
}

interface SFXDB extends DBSchema {
    sounds: {
        key: string;
        value: Sound;
        indexes: { 'by-category': string };
    };
}

const DB_NAME = 'sfx-manager-db';
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase<SFXDB>> => {
    return openDB<SFXDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('sounds')) {
                const store = db.createObjectStore('sounds', { keyPath: 'id' });
                store.createIndex('by-category', 'category');
            }
        },
    });
};

export const addSound = async (sound: Sound): Promise<string> => {
    const db = await initDB();
    await db.put('sounds', sound);
    return sound.id;
};

export const getAllSounds = async (): Promise<Sound[]> => {
    const db = await initDB();
    return db.getAll('sounds');
};

export const getSound = async (id: string): Promise<Sound | undefined> => {
    const db = await initDB();
    return db.get('sounds', id);
};

export const updateSound = async (sound: Sound): Promise<string> => {
    const db = await initDB();
    await db.put('sounds', sound);
    return sound.id;
};

export const deleteSound = async (id: string): Promise<void> => {
    const db = await initDB();
    await db.delete('sounds', id);
};
