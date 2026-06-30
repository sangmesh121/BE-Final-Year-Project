import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../constants/SupabaseConfig';

console.log('Supabase Config:', {
    url: SupabaseConfig.url,
    keyLength: SupabaseConfig.anonKey?.length
});

if (!SupabaseConfig.url || !SupabaseConfig.anonKey) {
    console.error('Supabase Configuration Missing! Check .env file.');
}

export const supabase = createClient(SupabaseConfig.url, SupabaseConfig.anonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
