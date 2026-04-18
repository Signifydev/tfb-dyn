import { createClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseServiceRoleKey, getSupabaseUrl } from '@/lib/env';

const supabaseUrl = getSupabaseUrl();
const serviceRoleKey = getSupabaseServiceRoleKey() || getSupabaseAnonKey();

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
