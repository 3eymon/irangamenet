import { createContext } from "react";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "../types/database.types";

export type Profile = Pick<
  Tables<"profiles">,
  "avatar_path" | "display_name" | "username"
> | null;

export type AuthContextType = {
  user: User | null;
  profile: Profile;
  isAuthenticated: boolean;
  isProfileCompleted: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);