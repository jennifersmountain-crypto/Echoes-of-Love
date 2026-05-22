import { createClient } from '@supabase/supabase-js';

// These would be environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  share_email: boolean;
  share_phone: boolean;
  created_at: string;
};

export type Message = {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
};

export type Photo = {
  id: number;
  user_id: string;
  url: string;
  caption: string | null;
  created_at: string;
  profile?: Profile;
};

export type Voicemail = {
  id: number;
  user_id: string;
  url: string;
  is_public: boolean;
  created_at: string;
  profile?: Profile;
};