import { createClient, SupabaseClient } from "@supabase/supabase-js";
import 'dotenv/config';

export const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

