"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Image,
  Text,
  Heading,
  Spinner,
  Center,
  VStack,
  Divider,
  Button,
  Flex,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

interface Props {
  params: { id: string };
}

const CharacterDetail = ({ params }: Props) => {
  const router = useRouter();
  const { id } = params;
  const [character, setCharacter] = useState<{
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
  } | null>(null);
  const [movies, setMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`https://swapi.dev/api/people/${id}`)
        .then((response) => {
          setCharacter(response.data);
          return Promise.all(
            response.data.films.map((film: string) => axios.get(film))
          );
        })
        .then((filmResponses: { data: { title: string } }[]) => {
          setMovies(filmResponses.map((res) => res.data.title));
          setLoading(false);
        });
    }
  }, [id]);

  if (!character)
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Container maxW="container.md" py={4}>
      <Button onClick={() => router.back()} mb={4} gap={2}>
        <ArrowBackIcon />
        Back
      </Button>
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <Center>
          <Image
            src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
            alt={character.name}
            borderRadius={"full"}
            boxSize="150px"
          />
        </Center>
        <VStack align="start" mt={2}>
          <Heading fontSize="xl">{character.name}</Heading>
          <Divider />
          <Flex justify="space-between" w="100%">
            <Text fontWeight={"bold"}>Height:</Text>
            <Text>{character.height}</Text>
          </Flex>
          <Flex justify="space-between" w="100%">
            <Text fontWeight={"bold"}>Mass:</Text>
            <Text>{character.mass}</Text>
          </Flex>
          <Flex justify="space-between" w="100%">
            <Text fontWeight={"bold"}>Hair Color:</Text>
            <Text>{character.hair_color}</Text>
          </Flex>
          <Flex justify="space-between" w="100%">
            <Text fontWeight={"bold"}>Skin Color:</Text>
            <Text>{character.skin_color}</Text>
          </Flex>
          <Flex justify="space-between" w="100%">
            <Text fontWeight={"bold"}>Eye Color:</Text>
            <Text>{character.eye_color}</Text>
          </Flex>
          <Flex justify="space-between" w="100%">
            <Text fontWeight={"bold"}>Birth Year:</Text>
            <Text>{character.birth_year}</Text>
          </Flex>
          <Flex justify="space-between" w="100%">
            <Text fontWeight={"bold"}>Gender:</Text>
            <Text>{character.gender}</Text>
          </Flex>
        </VStack>
        <Divider mt={4} />
        {loading ? (
          <Spinner size="xl" mt={4} />
        ) : (
          <>
            <Heading mt={4} fontSize="lg">
              Movies
            </Heading>
            <Wrap spacing={4} mt={2}>
              {movies.map((movie, index) => (
                <WrapItem key={index}>
                  <Button>{movie}</Button>
                </WrapItem>
              ))}
            </Wrap>
          </>
        )}
      </Box>
    </Container>
  );
};

export default CharacterDetail;
