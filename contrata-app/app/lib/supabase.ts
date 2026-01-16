import { createClient } from '@supabase/supabase-js';

// Pegue esses dados no seu painel do Supabase (Settings > API)
const supabaseUrl = 'https://pvdldpwibhhpfpjurlaz.supabase.co';
const supabaseAnonKey = 'sb_publishable_8eCvta-JK-eRX0VmdRVjMg_AfPG3jGW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);