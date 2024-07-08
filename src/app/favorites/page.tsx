"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Button,
  Image,
  Text,
  Center,
  AspectRatio,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";

const Favorites = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<{ name: string; url: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<{ name: string; url: string }[]>(
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites") as string) || [];
      setFavorites(storedFavorites);
    }
  }, []);

  async function GetFavorites() {
    try {
      const responses: AxiosResponse<any, any>[] = await Promise.all(
        favorites.map((id) => axios.get(`https://swapi.dev/api/people/${id}`))
      );
      const res: { name: string; url: string; id: string }[] = responses.map(
        (response) => ({
          name: response.data.name,
          url: response.data.url,
          id: response.data.url.split("/")[5],
        })
      );
      setCharacters(res);
    } catch (error) {
      console.error("error::", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (favorites) {
      setLoading(true);
      GetFavorites();
    }
  }, [favorites]);

  return (
    <Container maxW="container.xl" py={4}>
      <Button onClick={() => router.back()} mb={4} gap={2}>
        <ArrowBackIcon />
        Back
      </Button>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
        {favorites.length === 0 ? (
          <Center height="100vh">
            <Text fontSize="xl">No favorites added yet.</Text>
          </Center>
        ) : (
          characters.map((character) => (
            <Box
              key={character.name}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
            >
              <AspectRatio ratio={16 / 12}>
                <Image
                  src={`https://starwars-visualguide.com/assets/img/characters/${
                    character.url?.split("/")[5]
                  }.jpg`}
                  alt={character.name}
                  borderRadius={10}
                />
              </AspectRatio>
              <Box mt={2} display="flex" flexDirection="column">
                <Text mt={2} fontSize="xl">
                  {character.name}
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={() =>
                    router.push(`/character/${character.url.split("/")[5]}`)
                  }
                >
                  View Details
                </Button>
              </Box>
            </Box>
          ))
        )}
      </SimpleGrid>
    </Container>
  );
};

export default Favorites;
