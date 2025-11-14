import { type User, type InsertUser, type MixRequest, type InsertMixRequest } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createMixRequest(request: InsertMixRequest): Promise<MixRequest>;
  getAllMixRequests(): Promise<MixRequest[]>;
  clearMixRequests(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private mixRequests: Map<string, MixRequest>;

  constructor() {
    this.users = new Map();
    this.mixRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMixRequest(insertRequest: InsertMixRequest): Promise<MixRequest> {
    const id = randomUUID();
    const request: MixRequest = {
      ...insertRequest,
      id,
      timestamp: new Date(),
    };
    this.mixRequests.set(id, request);
    return request;
  }

  async getAllMixRequests(): Promise<MixRequest[]> {
    return Array.from(this.mixRequests.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async clearMixRequests(): Promise<void> {
    this.mixRequests.clear();
  }
}

export const storage = new MemStorage();
