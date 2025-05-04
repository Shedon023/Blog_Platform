import { create } from "zustand";
import { User } from "./types";

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
