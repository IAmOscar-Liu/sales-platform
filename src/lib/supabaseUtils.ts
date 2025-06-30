import { type Tables } from "@/types/supabase";
import { supabase } from "./supabaseClient";

// outside of the function, module-level
const userRequestCache: Record<string, Promise<null | Tables<"users">>> = {};

export async function fetchUser(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (profileError) console.error(profileError);
  console.log("profile", profile);
  return profile;
}

export async function fetchUserCache(userId: string) {
  // check if there is an in-flight request
  if (userRequestCache[userId] !== undefined) {
    return userRequestCache[userId];
  }

  // if not, start a new request and store the promise
  const fetchUserPromise = fetchUser(userId);
  userRequestCache[userId] = fetchUserPromise;
  return fetchUserPromise.then((result) => {
    delete userRequestCache[userId];
    return result;
  });
}
