import { createClient } from '@supabase/supabase-js';

// Временно возвращаем заглушку вместо реального клиента
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: null, error: new Error('Supabase not configured') })
  }
};