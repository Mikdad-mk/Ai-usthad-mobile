import { supabase } from "./supabase";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: "user" | "admin";
  created_at: string;
  avatar_url?: string | null;
}

const ADMIN_EMAIL = "admin@aiustad.app";

export function getUserInitials(name: string): string {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "AU"
  );
}

export async function signUpUser(
  email: string,
  password: string,
  name: string
) {
  const initials = getUserInitials(name);
  const role = email === ADMIN_EMAIL ? "admin" : "user";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        initials,
        role,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error("Failed to create user");

  const { error: insertError } = await supabase.from("user_profiles").insert({
    id: data.user.id,
    email: data.user.email || email,
    full_name: name,
    avatar_url: null,
    role: role,
  });

  if (insertError) {
    console.warn("Failed to create profile:", insertError);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  return {
    user: data.user,
    profile: profile
      ? {
          id: profile.id,
          email: profile.email,
          name: profile.full_name || email.split("@")[0],
          initials,
          role: profile.role as "user" | "admin",
          created_at: profile.created_at,
          avatar_url: profile.avatar_url,
        }
      : {
          id: data.user.id,
          email: data.user.email || email,
          name,
          initials,
          role,
          created_at: new Date().toISOString(),
          avatar_url: null,
        },
  };
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error("Failed to sign in");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    const initials = (data.user.email || email).substring(0, 2).toUpperCase();
    const fullName = data.user.user_metadata?.full_name || email.split("@")[0];
    const role =
      email === ADMIN_EMAIL
        ? "admin"
        : data.user.user_metadata?.role || "user";

    const { data: newProfile } = await supabase
      .from("user_profiles")
      .insert({
        id: data.user.id,
        email: data.user.email || email,
        full_name: fullName,
        avatar_url: data.user.user_metadata?.avatar_url || null,
        role: role,
      })
      .select()
      .maybeSingle();

    return {
      user: data.user,
      profile: newProfile
        ? {
            id: newProfile.id,
            email: newProfile.email,
            name: newProfile.full_name || email.split("@")[0],
            initials,
            role: newProfile.role as "user" | "admin",
            created_at: newProfile.created_at,
            avatar_url: newProfile.avatar_url,
          }
        : {
            id: data.user.id,
            email: data.user.email || email,
            name: fullName,
            initials,
            role: role as "user" | "admin",
            created_at: data.user.created_at || new Date().toISOString(),
            avatar_url: data.user.user_metadata?.avatar_url || null,
          },
    };
  }

  return {
    user: data.user,
    profile: {
      id: profile.id,
      email: profile.email,
      name: profile.full_name || email.split("@")[0],
      initials: (profile.full_name || email).substring(0, 2).toUpperCase(),
      role: profile.role as "user" | "admin",
      created_at: profile.created_at,
      avatar_url: profile.avatar_url,
    },
  };
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (error.message !== "Auth session missing!") {
        console.error("Auth error:", error.message);
      }
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  if (!uid || uid === "undefined") {
    console.error("Error fetching profile: invalid or missing user ID");
    return null;
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", uid)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  if (!profile) {
    console.warn("No profile found for user:", uid);
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name || profile.email.split("@")[0],
    initials: (profile.full_name || profile.email).substring(0, 2).toUpperCase(),
    role: profile.role as "user" | "admin",
    created_at: profile.created_at,
    avatar_url: profile.avatar_url,
  };
}

export async function signInWithGoogle() {
  try {
    const redirectUrl = Linking.createURL("/");
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
      },
    });

    if (error) throw error;

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success") {
        const url = result.url;
        const params = new URL(url).searchParams;
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (sessionError) throw sessionError;

          if (sessionData.user) {
            // Check if profile exists, create if not
            const { data: existingProfile } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", sessionData.user.id)
              .maybeSingle();

            if (!existingProfile) {
              const fullName =
                sessionData.user.user_metadata?.full_name ||
                sessionData.user.email?.split("@")[0] ||
                "User";
              const role =
                sessionData.user.email === ADMIN_EMAIL ? "admin" : "user";

              await supabase.from("user_profiles").insert({
                id: sessionData.user.id,
                email: sessionData.user.email || "",
                full_name: fullName,
                avatar_url: sessionData.user.user_metadata?.avatar_url || null,
                role: role,
              });
            }

            return sessionData.user;
          }
        }
      }
    }

    throw new Error("Failed to complete Google sign-in");
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}
