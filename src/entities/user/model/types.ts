export type User = {
  bio: string;
  email: string;
  image: string | null;
  token: string;
  username: string;
};

export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};
