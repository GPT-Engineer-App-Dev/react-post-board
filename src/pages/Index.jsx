import { useState } from "react";
import { Container, VStack, HStack, Text, Input, Button, Box, IconButton, Flex } from "@chakra-ui/react";
import { FaThumbsUp, FaHeart } from "react-icons/fa";
import { usePosts, useAddPost, useAddReaction } from '../integrations/supabase/api';

const Index = () => {
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const addPostMutation = useAddPost();
  const addReactionMutation = useAddReaction();
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (newPost.trim() !== "") {
      addPostMutation.mutate({ title: newPost, body: newPost });
      setNewPost("");
    }
  };

  const handleReaction = (postId, emoji) => {
    addReactionMutation.mutate({ post_id: postId, emoji });
  };

  if (postsLoading) return <Text>Loading...</Text>;
  if (postsError) return <Text>Error loading posts</Text>;

  return (
    <Container maxW="container.md" p={4}>
      <Box as="nav" w="100%" p={4} bg="blue.500" color="white" mb={4}>
        <Text fontSize="xl" fontWeight="bold">Post Board</Text>
      </Box>
      <VStack spacing={4} align="stretch">
        <Box>
          <Input
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            mb={2}
          />
          <Button onClick={handlePost} colorScheme="blue" isLoading={addPostMutation.isLoading}>Post</Button>
        </Box>
        {posts.map((post) => (
          <Box key={post.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
            <Text mb={2}>{post.body}</Text>
            <HStack spacing={4}>
              <Flex align="center">
                <IconButton
                  aria-label="Like"
                  icon={<FaThumbsUp />}
                  onClick={() => handleReaction(post.id, "👍")}
                />
                <Text ml={2}>{post.reactions?.filter(r => r.emoji === "👍").length || 0}</Text>
              </Flex>
              <Flex align="center">
                <IconButton
                  aria-label="Love"
                  icon={<FaHeart />}
                  onClick={() => handleReaction(post.id, "❤️")}
                />
                <Text ml={2}>{post.reactions?.filter(r => r.emoji === "❤️").length || 0}</Text>
              </Flex>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;