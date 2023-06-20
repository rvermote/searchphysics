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

  const OpenLink = (search:Object) => {
    let seconds = Math.max(0,search["start"]-5)
    try{
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds - (hours * 3600)) / 60)
      const sec = seconds - (hours * 3600) - (minutes * 60)
      window.open("https://www.youtube.com/watch?v="+search["url"]+"&t="+hours+"h"+minutes+"m"+sec+"s", "_blank")
    }catch(e){
      console.log(e)
    }
  }

  const secondsToHour = (seconds:number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds - (hours * 3600)) / 60)
    const sec = seconds - (hours * 3600) - (minutes * 60)
    return hours + ":" + minutes + ":" + sec
  }
    

  const makeText = (text:string,searches:Object[],index:number) => {
    return (
      <React.Fragment key={`${text}_${index}`}>
        <Text key={`${text}_${index}_main`} m="2" fontSize="lg">{text}</Text>
        {searches.map((search, subIndex) => (
          <Flex key={`${text}_${index}_sub_${subIndex}_main`} direction="column" gap = "2" bg={subIndex%2 ? "gray.300" : "gray.100"} borderRadius="10" p="6" position="relative">
            <Text key={`${text}_${index}_sub_${subIndex}_index`} position="absolute" top="0.35rem" left="0.35rem" color={subIndex==0?"yellow.500":"gray.500"}>#{subIndex+1}</Text>
            <Text key={`${text}_${index}_sub_${subIndex}_title`} fontWeight="600" align="center">{search["title"]} </Text>
            <Text key={`${text}_${index}_sub_${subIndex}_text`} display={ subIndex>1?"none":""} >... {search["text"]} ...</Text>
            <Text key={`${text}_${index}_sub_${subIndex}_time`} align="right" color="gray.500" onClick={() => OpenLink(search)}> 
              <span className="hover:cursor-pointer">{secondsToHour(search["start"])} - {secondsToHour(search["end"])} </span>
            </Text>
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