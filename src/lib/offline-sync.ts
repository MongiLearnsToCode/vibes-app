// src/lib/offline-sync.ts
export type OfflineVibe = {
  id: string;
  relationshipId: string;
  userId: string;
  mood: number;
  note?: string;
  timestamp: number;
};

const STORAGE_KEY = "offline_vibes";

export class OfflineSync {
  static saveVibe(vibe: Omit<OfflineVibe, "id" | "timestamp">): void {
    try {
      const offlineVibes = this.getOfflineVibes();
      const newVibe: OfflineVibe = {
        ...vibe,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      offlineVibes.push(newVibe);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineVibes));
    } catch (error) {
      console.error("Failed to save offline vibe:", error);
    }
  }

  static getOfflineVibes(): OfflineVibe[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to get offline vibes:", error);
      return [];
    }
  }

  static removeVibe(id: string): void {
    try {
      const offlineVibes = this.getOfflineVibes();
      const filtered = offlineVibes.filter(vibe => vibe.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to remove offline vibe:", error);
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear offline vibes:", error);
    }
  }
}