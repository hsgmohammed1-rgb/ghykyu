import { createClient } from "@supabase/supabase-js";

// Taking values from the prompt explicitly
const supabaseUrl = "https://vqgtuerxushiraudybis.supabase.co";
const supabaseKey = "sb_publishable_P2wRhMEHLxSvdXDS24KRfQ_lG4rwXvd";

// Using valid url to init, but notice that if this pub key acts like anon key, it will work for broadcast
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
