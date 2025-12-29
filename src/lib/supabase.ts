import { createClient } from '@supabase/supabase-js';

// Substitua com os dados que estão em Settings > API no site do Supabase
const SUPABASE_URL = "https://vpwsofbuuhemfodanjuv.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_fZSWhMQ8bKaKZp4mEMneQw_NmXV7yGC";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);