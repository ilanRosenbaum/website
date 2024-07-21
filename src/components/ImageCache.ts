import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./../firebase";

class ImageCache {
  private cache: Map<string, Promise<string>>;

  constructor() {
    this.cache = new Map();
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedCache = JSON.parse(localStorage.getItem('imageCache') || '{}');
    Object.entries(savedCache).forEach(([key, value]) => {
      this.cache.set(key, Promise.resolve(value as string));
    });
  }

  async getImage(path: string): Promise<string> {
    if (!this.cache.has(path)) {
      this.cache.set(path, this.fetchImage(path));
    }
    return this.cache.get(path)!;
  }

  private async fetchImage(path: string): Promise<string> {
    try {
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      
      // Store the URL directly instead of converting to data URL
      this.saveToLocalStorage(path, url);
      return url;
    } catch (error) {
      console.error("Error fetching image from Firebase:", error);
      return "";
    }
  }

  private saveToLocalStorage(path: string, url: string) {
    const savedCache = JSON.parse(localStorage.getItem('imageCache') || '{}');
    savedCache[path] = url;
    localStorage.setItem('imageCache', JSON.stringify(savedCache));
  }
}

export const imageCache = new ImageCache();