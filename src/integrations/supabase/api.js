import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to handle Supabase queries
const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// Types and relations documentation
/**
 * Type: Post
 * Fields:
 * - id: integer
 * - title: text
 * - body: text
 * - created_at: timestamp with time zone
 * - author_id: uuid
 * 
 * Type: Reaction
 * Fields:
 * - id: integer
 * - post_id: integer (Foreign Key to posts.id)
 * - user_id: uuid
 * - emoji: character
 */

// Hooks for Posts
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

// Hooks for Reactions
export const useReactions = (postId) => useQuery({
  queryKey: ['reactions', postId],
  queryFn: () => fromSupabase(supabase.from('reactions').select('*').eq('post_id', postId)),
});

export const useAddReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReaction) => fromSupabase(supabase.from('reactions').insert([newReaction])),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['reactions', variables.post_id]);
    },
  });
};