"use client";
import { useState, useEffect, Suspense } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Button,
  Image,
  Text,
  Center,
  Spinner,
  AspectRatio,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [characters, setCharacters] = useState<
    { name: string; url: string; id: string }[]
  >([]);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://swapi.dev/api/people/?page=${page}`).then((response) => {
      setCharacters(response.data.results);
      setLoading(false);
    });
  }, [page]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("favorites") as string).length
    ) {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favorites") as string
      );

      setFavorites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (character: { name: string; url: string }) => {
    const id = character.url.split("/")[5];

    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <Suspense
      fallback={
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <Container maxW="container.xl" py={4}>
        {loading ? (
          <Center height="100vh">
            <Spinner size="xl" />
          </Center>
        ) : (
          <>
            <Button
              colorScheme="yellow"
              marginBottom={2}
              onClick={() => router.push("/favorites")}
            >
              See All Favorites
            </Button>
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
              {characters.map((character) => (
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
                        character.url.split("/")[5]
                      }.jpg`}
                      alt={character.name}
                      borderRadius={10}
                    />
                  </AspectRatio>
                  <Box mt={2} display="flex" flexDirection="column">
                    <Text mt={2} fontSize="xl">
                      {character.name}
                    </Text>
                    <Box mt={2} display="flex" alignItems="center">
                      <Button
                        mr={2}
                        colorScheme={
                          favorites.includes(character.url.split("/")[5])
                            ? "red"
                            : "teal"
                        }
                        onClick={() => toggleFavorite(character)}
                      >
                        {favorites.includes(character.url.split("/")[5])
                          ? "Unfavorite"
                          : "Favorite"}
                      </Button>
                      <Button
                        colorScheme="blue"
                        onClick={() =>
                          router.push(
                            `/character/${character.url.split("/")[5]}`
                          )
                        }
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                  {/* </Box> */}
                </Box>
              ))}
            </SimpleGrid>
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
              <Button onClick={() => setPage(page - 1)} isDisabled={page === 1}>
                Previous
              </Button>
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            </Box>
          </>
        )}
      </Container>
    </Suspense>
  );
};

export default Home;
