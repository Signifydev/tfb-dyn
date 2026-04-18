import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/env";

const supabaseUrl = getSupabaseUrl();
const supabaseKey = getSupabaseAnonKey();

export const supabase = createClient(supabaseUrl, supabaseKey);
