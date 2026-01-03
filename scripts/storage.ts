/**
 * Persistent storage using IndexedDB for state preservation across page loads.
 */
export class PersistentStorage {
  private dbName = "laconicd_storage";
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("kv")) {
          db.createObjectStore("kv");
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        console.log("[Storage] IndexedDB initialized.");
        resolve();
      };

      request.onerror = () => {
        console.error("[Storage] IndexedDB failed to open.");
        reject();
      };
    });
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction("kv", "readwrite");
      const store = transaction.objectStore("kv");
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject();
    });
  }

  async get(key: string): Promise<any> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction("kv", "readonly");
      const store = transaction.objectStore("kv");
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject();
    });
  }
}

export const storage = new PersistentStorage();
