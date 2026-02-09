import { ref, getDownloadURL, listAll, getMetadata, StorageReference, ListResult } from "firebase/storage";
import { storage } from "./../firebase";

interface CachedFolderListing {
  prefixes: string[]; // subfolder names
  items: string[]; // file names
  timestamp: number;
}

interface CachedFileMetadata {
  updated: string;
  timeCreated: string;
  timestamp: number;
}

interface CachedData {
  urls: Record<string, string>;
  folderListings: Record<string, CachedFolderListing>;
  fileMetadata: Record<string, CachedFileMetadata>;
}

const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

class ImageCache {
  private urlCache: Map<string, Promise<string>>;
  private folderListingCache: Map<string, Promise<{ prefixes: StorageReference[]; items: StorageReference[] }>>;
  private metadataCache: Map<string, Promise<{ updated: string; timeCreated: string }>>;

  constructor() {
    this.urlCache = new Map();
    this.folderListingCache = new Map();
    this.metadataCache = new Map();
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedCache: CachedData = JSON.parse(localStorage.getItem("firebaseCache") || '{"urls":{},"folderListings":{},"fileMetadata":{}}');
      const now = Date.now();

      // Load URLs
      Object.entries(savedCache.urls || {}).forEach(([key, value]) => {
        this.urlCache.set(key, Promise.resolve(value));
      });

      // Load folder listings (if not expired)
      Object.entries(savedCache.folderListings || {}).forEach(([key, value]) => {
        if (now - value.timestamp < CACHE_EXPIRY_MS) {
          // Create mock StorageReference-like objects for cached data
          const prefixes = value.prefixes.map((name) => ref(storage, `${key}/${name}`));
          const items = value.items.map((name) => ref(storage, `${key}/${name}`));
          this.folderListingCache.set(key, Promise.resolve({ prefixes, items }));
        }
      });

      // Load file metadata (if not expired)
      Object.entries(savedCache.fileMetadata || {}).forEach(([key, value]) => {
        if (now - value.timestamp < CACHE_EXPIRY_MS) {
          this.metadataCache.set(key, Promise.resolve({ updated: value.updated, timeCreated: value.timeCreated }));
        }
      });
    } catch (error) {
      console.warn("Error loading cache from localStorage:", error);
    }
  }

  private saveToLocalStorage() {
    try {
      const urlsObj: Record<string, string> = {};
      this.urlCache.forEach((promise, key) => {
        // Only save resolved promises (skip pending ones)
        promise.then((url) => {
          if (url) urlsObj[key] = url;
        });
      });

      // For folder listings and metadata, we save them incrementally
      const savedCache: CachedData = JSON.parse(localStorage.getItem("firebaseCache") || '{"urls":{},"folderListings":{},"fileMetadata":{}}');
      savedCache.urls = { ...savedCache.urls, ...urlsObj };

      localStorage.setItem("firebaseCache", JSON.stringify(savedCache));
    } catch (error) {
      console.warn("Error saving cache to localStorage:", error);
    }
  }

  private saveFolderListingToLocalStorage(path: string, prefixes: string[], items: string[]) {
    try {
      const savedCache: CachedData = JSON.parse(localStorage.getItem("firebaseCache") || '{"urls":{},"folderListings":{},"fileMetadata":{}}');
      savedCache.folderListings[path] = {
        prefixes,
        items,
        timestamp: Date.now()
      };
      localStorage.setItem("firebaseCache", JSON.stringify(savedCache));
    } catch (error) {
      console.warn("Error saving folder listing to localStorage:", error);
    }
  }

  private saveMetadataToLocalStorage(path: string, updated: string, timeCreated: string) {
    try {
      const savedCache: CachedData = JSON.parse(localStorage.getItem("firebaseCache") || '{"urls":{},"folderListings":{},"fileMetadata":{}}');
      savedCache.fileMetadata[path] = {
        updated,
        timeCreated,
        timestamp: Date.now()
      };
      localStorage.setItem("firebaseCache", JSON.stringify(savedCache));
    } catch (error) {
      console.warn("Error saving metadata to localStorage:", error);
    }
  }

  async getImage(path: string): Promise<string> {
    if (!this.urlCache.has(path)) {
      this.urlCache.set(path, this.fetchImage(path));
    }
    return this.urlCache.get(path)!;
  }

  private async fetchImage(path: string): Promise<string> {
    try {
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      this.saveToLocalStorage();
      return url;
    } catch (error) {
      console.error("Error fetching image from Firebase:", error);
      return "";
    }
  }

  async getDownloadURL(path: string): Promise<string> {
    if (!this.urlCache.has(path)) {
      const promise = (async () => {
        try {
          const fileRef = ref(storage, path);
          const url = await getDownloadURL(fileRef);
          this.saveToLocalStorage();
          return url;
        } catch (error) {
          console.error("Error fetching download URL:", error);
          return "";
        }
      })();
      this.urlCache.set(path, promise);
    }
    return this.urlCache.get(path)!;
  }

  async listAll(path: string): Promise<{ prefixes: StorageReference[]; items: StorageReference[] }> {
    if (!this.folderListingCache.has(path)) {
      const promise = (async () => {
        try {
          const folderRef = ref(storage, path);
          const result = await listAll(folderRef);

          // Save to localStorage
          this.saveFolderListingToLocalStorage(
            path,
            result.prefixes.map((p) => p.name),
            result.items.map((i) => i.name)
          );

          return { prefixes: result.prefixes, items: result.items };
        } catch (error) {
          console.error("Error listing folder:", error);
          return { prefixes: [], items: [] };
        }
      })();
      this.folderListingCache.set(path, promise);
    }
    return this.folderListingCache.get(path)!;
  }

  async getMetadata(itemRef: StorageReference): Promise<{ updated: string; timeCreated: string }> {
    const path = itemRef.fullPath;
    if (!this.metadataCache.has(path)) {
      const promise = (async () => {
        try {
          const meta = await getMetadata(itemRef);
          const result = {
            updated: meta.updated || meta.timeCreated,
            timeCreated: meta.timeCreated
          };

          // Save to localStorage
          this.saveMetadataToLocalStorage(path, result.updated, result.timeCreated);

          return result;
        } catch (error) {
          console.error("Error getting metadata:", error);
          return { updated: "", timeCreated: "" };
        }
      })();
      this.metadataCache.set(path, promise);
    }
    return this.metadataCache.get(path)!;
  }

  // Clear expired entries
  clearExpired() {
    try {
      const savedCache: CachedData = JSON.parse(localStorage.getItem("firebaseCache") || '{"urls":{},"folderListings":{},"fileMetadata":{}}');
      const now = Date.now();

      // Clear expired folder listings
      Object.keys(savedCache.folderListings).forEach((key) => {
        if (now - savedCache.folderListings[key].timestamp >= CACHE_EXPIRY_MS) {
          delete savedCache.folderListings[key];
          this.folderListingCache.delete(key);
        }
      });

      // Clear expired metadata
      Object.keys(savedCache.fileMetadata).forEach((key) => {
        if (now - savedCache.fileMetadata[key].timestamp >= CACHE_EXPIRY_MS) {
          delete savedCache.fileMetadata[key];
          this.metadataCache.delete(key);
        }
      });

      localStorage.setItem("firebaseCache", JSON.stringify(savedCache));
    } catch (error) {
      console.warn("Error clearing expired cache:", error);
    }
  }

  // Force refresh a specific path (useful when you know content has changed)
  invalidate(path: string) {
    this.urlCache.delete(path);
    this.folderListingCache.delete(path);
    this.metadataCache.delete(path);
  }
}

export const imageCache = new ImageCache();
