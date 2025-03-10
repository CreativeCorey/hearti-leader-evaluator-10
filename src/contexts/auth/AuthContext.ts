
import { createContext } from "react";
import { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  anonymousId: string;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name?: string, organization?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  error: string | null;
  anonymousMode: boolean;
  toggleAnonymousMode: () => void;
};

// Create the Auth context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
