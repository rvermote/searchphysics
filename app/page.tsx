"use client"
import {useEffect,useState} from "react";
import {ChakraProvider,Input,Container,Flex,extendTheme, Text} from "@chakra-ui/react";
import React from "react";

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

type Result = [string, Object]

export default function Home() {

  const [text, setText] = useState<string>("")
  const [results, setResults] = useState<Result[]>([])
  const [debounce, setDebounce] = useState<boolean>(true)

  const fetchPinecone = () => {fetch("/api/pineconeRequest", {
    method: "POST",
    body: JSON.stringify({question: text}),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status + " " + res.statusText)
        else return res.json() 
      })
      .then((data) => {
        setResults((prevResults) => [...prevResults, [text,data.message]])
      })
      .catch(error => console.log(error))}


  const sendRequest = () => {
    if (debounce){
      setDebounce(false)
      setText("")
      fetchPinecone()
      setTimeout(() => {setDebounce(true)}, 3000)
    }
  }

  const makeText = (text,searches,index) => {
    return (
      <React.Fragment key={`${text}_${index}`}>
        <Text m="2" fontSize="lg">{text}</Text>
        {searches.map((search, subIndex) => (
          <Flex direction="column" gap = "2" bg={subIndex%2 ? "gray.300" : "gray.100"} borderRadius="10" p="6">
            <Text key={`${text}_${index}_sub_${subIndex}_title`} fontWeight="600" align="center">{search["title"]} </Text>
            <Text key={`${text}_${index}_sub_${subIndex}_text`} >... {search["text"]} ...</Text>
          </Flex>
        ))}
      </React.Fragment>
    )}

  return (
      <ChakraProvider theme={theme}>
        <Container maxW="1000px" my="5">
          <Flex direction="column-reverse" justifyContent="flex-start" align="center" gap="5" minH="calc(100vh - 5rem)">
            <Container id="main" textAlign="center">
              <Input placeholder="Send a question" value={text} onChange={(e) => setText(e.target.value)} onKeyUp={(event) => {if (event.key ==="Enter") sendRequest()}} p="1.5rem"/>
            </Container>
            <Container maxHeight="calc(100vh - 10rem)"overflow="auto">
              <Flex direction="column" justifyContent="flex-end" align = "center" gap="2">
                {results.map(([text,searches],index) => makeText(text,searches,index))}
              </Flex>
            </Container>
          </Flex>
        </Container>
      </ChakraProvider>
)}


{/* <Container id="main" position="sticky" bottom="0" z-index="10" bg="black">
  <Input placeholder="Send a question" onChange={(e) => setText(e.target.value)} onKeyUp={(event) => {if (event.key ==="Enter") sendRequest()}} p="1.5rem" my="1rem"/>
</Container> */}