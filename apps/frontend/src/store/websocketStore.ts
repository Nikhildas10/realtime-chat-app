import { create } from "zustand";

interface SocketStore {
  onlineUsers: string[];
  isTypingFrom: string | null;
  setOnlineUsers: (users: string[]) => void;
  setTypingFrom: (userId: string | null) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  onlineUsers: [],
  isTypingFrom: null,
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setTypingFrom: (userId) => set({ isTypingFrom: userId }),
}));
