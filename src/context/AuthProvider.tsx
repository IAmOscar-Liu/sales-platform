import { supabase } from "@/lib/supabaseClient";
import * as supabaseUtils from "@/lib/supabaseUtils";
import { waitFor } from "@/lib/utils";
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
  isLoggingOut: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  currentUser: Tables<"users"> | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<Tables<"users"> | null>>;
  loginWithOauth(provider: Provider): Promise<void>;
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string): Promise<void>;
  logout(cb?: () => void): Promise<void>;
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`onAuthStateChange - ${event}`);
        updateSessionUser(session);
      },
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

  async function logout(cb?: () => void) {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    // const a = true;
    // if (a) {
    if (error) {
      await handleLogOutFailure();
      await waitFor(200); // force to clear user
      window.location.reload();
    }
    setIsLoggingOut(false);
    if (cb) setTimeout(() => cb(), 1000);
  }

  async function handleLogOutFailure() {
    const { error: retryLogInError } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_ADMIN_USER_EMAIL,
      password: import.meta.env.VITE_ADMIN_USER_PASS,
    });
    if (retryLogInError) return false;
    const { error: retryLogOutError } = await supabase.auth.signOut();

    await waitFor(500);

    if (retryLogOutError) return false;
    return true;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggingOut,
        isAuthenticated: !!session,
        session,
        loginWithOauth,
        login,
        register,
        logout,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
