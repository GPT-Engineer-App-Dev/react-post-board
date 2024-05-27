import { useState } from "react";
import { Container, VStack, HStack, Text, Input, Button, Box, IconButton, Flex } from "@chakra-ui/react";
import { FaThumbsUp, FaHeart } from "react-icons/fa";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (newPost.trim() !== "") {
      setPosts([...posts, { text: newPost, reactions: { like: 0, love: 0 } }]);
      setNewPost("");
    }
  };

  const handleReaction = (index, type) => {
    const updatedPosts = [...posts];
    updatedPosts[index].reactions[type]++;
    setPosts(updatedPosts);
  };

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
          <Button onClick={handlePost} colorScheme="blue">Post</Button>
        </Box>
        {posts.map((post, index) => (
          <Box key={index} p={4} shadow="md" borderWidth="1px" borderRadius="md">
            <Text mb={2}>{post.text}</Text>
            <HStack spacing={4}>
              <Flex align="center">
                <IconButton
                  aria-label="Like"
                  icon={<FaThumbsUp />}
                  onClick={() => handleReaction(index, "like")}
                />
                <Text ml={2}>{post.reactions.like}</Text>
              </Flex>
              <Flex align="center">
                <IconButton
                  aria-label="Love"
                  icon={<FaHeart />}
                  onClick={() => handleReaction(index, "love")}
                />
                <Text ml={2}>{post.reactions.love}</Text>
              </Flex>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;