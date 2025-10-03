import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qgjjmbyxppvmksvykwbe.supabase.co';
const supabaseAnonKey = 'sb_publishable_yddv5uc0jKxNqXRh5Bbvzw_01LNbkQQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
