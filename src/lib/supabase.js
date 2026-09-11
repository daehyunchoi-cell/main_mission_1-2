import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경변수가 빠졌을 때 조용히 실패하면 원인 찾기가 어려우므로 즉시 알린다.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase 환경변수가 없습니다. .env.local에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정한 뒤 개발 서버를 재시작하세요.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);