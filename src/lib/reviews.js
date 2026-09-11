import { supabase } from './supabase';

// 목록 조회 — 최신순
export async function fetchReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// 상세 조회 — id 하나
export async function fetchReviewById(id) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data; // 없으면 null
}

// 등록
export async function createReview(payload) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// 수정
export async function updateReview(id, payload) {
  const { data, error } = await supabase
    .from('reviews')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// 삭제
export async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw new Error(error.message);
}