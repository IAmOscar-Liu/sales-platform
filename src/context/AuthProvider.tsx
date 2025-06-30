import { supabase } from "@/lib/supabaseClient";
import * as supabaseUtils from "@/lib/supabaseUtils";
import { type Tables } from "@/types/supabase";
import { type Provider, type Session } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  currentUser: Tables<"users"> | null;
  loginWithOauth(provider: Provider): Promise<void>;
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<Tables<"users"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("onAuthStateChange");
        // setIsLoading(false);
        updateSessionUser(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function updateSessionUser(newSession: Session | null) {
    setSession(newSession);
    const userId = newSession?.user.id;
    if (!userId) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    const profile = await supabaseUtils.fetchUserCache(userId);
    setCurrentUser(profile);
    setIsLoading(false);
  }

  async function loginWithOauth(provider: Provider) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (error) throw new Error(error.message);
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw new Error(error.message);
  }

  async function register(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) throw new Error(error.message);
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: !!session,
        session,
        loginWithOauth,
        login,
        register,
        logout,
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
