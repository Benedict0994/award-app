import { createContext } from "react";

export interface AuthUser {
  name: string;
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loginUser: (user: AuthUser, token: string) => void;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
