/**
 * Supabase API Wrapper
 * 
 * Types:
 * - Post: { id: number, title: string, body: string, created_at: string, author_id: string }
 * - Reaction: { id: number, post_id: number, user_id: string, emoji: string }
 * 
 * Relations:
 * - Post has many Reactions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const usePosts = () => useQuery({
  queryKey: ['posts'],
  queryFn: () => fromSupabase(supabase.from('posts').select('*')),
});

export const useAddPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPost) => fromSupabase(supabase.from('posts').insert([newPost])),
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });
};

export const useReactions = (postId) => useQuery({
  queryKey: ['reactions', postId],
  queryFn: () => fromSupabase(supabase.from('reactions').select('*').eq('post_id', postId)),
});

export const useAddReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReaction) => fromSupabase(supabase.from('reactions').insert([newReaction])),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['reactions', variables.post_id]);
    },
  });
};