import { type SavedNumber, type InsertSavedNumber } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSavedNumbers(sessionId: string): Promise<SavedNumber[]>;
  savePlaneNumber(data: InsertSavedNumber): Promise<SavedNumber>;
  deleteSavedNumber(id: string, sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private savedNumbers: Map<string, SavedNumber>;

  constructor() {
    this.savedNumbers = new Map();
  }

  async getSavedNumbers(sessionId: string): Promise<SavedNumber[]> {
    return Array.from(this.savedNumbers.values()).filter(
      (number) => number.sessionId === sessionId,
    );
  }

  async savePlaneNumber(data: InsertSavedNumber): Promise<SavedNumber> {
    const id = randomUUID();
    const savedNumber: SavedNumber = { 
      ...data,
      contactName: data.contactName || null,
      id, 
      createdAt: new Date()
    };
    this.savedNumbers.set(id, savedNumber);
    return savedNumber;
  }

  async deleteSavedNumber(id: string, sessionId: string): Promise<boolean> {
    const savedNumber = this.savedNumbers.get(id);
    if (savedNumber && savedNumber.sessionId === sessionId) {
      this.savedNumbers.delete(id);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
