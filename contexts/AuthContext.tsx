import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { UserProfile, getCurrentUser, getUserProfile } from "../lib/auth-service";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check active session
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (mounted) {
          if (currentUser) {
            setUser(currentUser);
            const userProfile = await getUserProfile(currentUser.id);
            if (mounted) {
              setProfile(userProfile);
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          const userProfile = await getUserProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
