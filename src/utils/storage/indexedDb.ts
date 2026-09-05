import type { StateStorage } from 'zustand/middleware';

const DB_NAME = 'endless-canvas';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available'));
  }

  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(request.error);
    });

    // Allow a later call to retry instead of caching a rejected promise forever.
    dbPromise.catch(() => {
      dbPromise = null;
    });
  }

  return dbPromise;
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const request = run(tx.objectStore(STORE_NAME));
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

// localStorage is the fallback when IndexedDB is unavailable (private windows,
// blocked site data) and the source for one-time migration of older canvases.
function readLocal(name: string): string | null {
  try {
    return window.localStorage.getItem(name);
  } catch {
    return null;
  }
}

function writeLocal(name: string, value: string) {
  try {
    window.localStorage.setItem(name, value);
  } catch {
    // Nothing more we can do; the canvas stays in memory for this session.
  }
}

function removeLocal(name: string) {
  try {
    window.localStorage.removeItem(name);
  } catch {
    // Ignore.
  }
}

export const indexedDbStorage: StateStorage = {
  getItem: async (name) => {
    try {
      const stored = await withStore<unknown>('readonly', (store) => store.get(name));
      if (typeof stored === 'string') return stored;

      // First run against IndexedDB: adopt whatever the old localStorage build saved.
      const legacy = readLocal(name);
      if (legacy !== null) {
        await withStore('readwrite', (store) => store.put(legacy, name));
        removeLocal(name);
        return legacy;
      }

      return null;
    } catch {
      return readLocal(name);
    }
  },

  setItem: async (name, value) => {
    try {
      await withStore('readwrite', (store) => store.put(value, name));
    } catch {
      writeLocal(name, value);
    }
  },

  removeItem: async (name) => {
    try {
      await withStore('readwrite', (store) => store.delete(name));
    } catch {
      // Ignore; the localStorage copy is cleared below either way.
    }
    removeLocal(name);
  },
};
