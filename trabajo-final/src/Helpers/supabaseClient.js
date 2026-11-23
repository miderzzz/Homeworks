import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

const supabase = isSupabaseConfigured ? createClient(url, key) : null;

export const getClient = () => {
  if (!supabase) {
    throw new Error('Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_KEY en el archivo .env');
  }
  return supabase;
};

export const unwrap = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return data;
};
