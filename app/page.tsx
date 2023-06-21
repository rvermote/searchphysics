"use client"
import {useEffect,useState} from "react";
import Image from "next/image";
import {ChakraProvider,Input,Container,Flex,extendTheme, Text} from "@chakra-ui/react";
import React from "react";
import {ReplaceTitle, OpenLink, secondsToHour} from "@/components/functions";

type Result = [string, Search[]]
type Search = {title:string, text:string, start:number, end:number, url:string}
type IDs = {[key:string]:boolean}
type TextState = {globalID : number, IDs : IDs}


export default function Home() {

  const [text, setText] = useState<string>("")
  const [results, setResults] = useState<Result[]>([])
  const [debounce, setDebounce] = useState<boolean>(true)
  const [textStates,setTextStates] = useState<TextState>({globalID : 0, IDs : {test:false}})

  useEffect(() => {
    const mainContainer = document.getElementById("mainContainer")
    if (mainContainer) mainContainer.scrollTop = mainContainer.scrollHeight
  }, [results])

  const textStateSetter= (index:number, subIndex:number, val:boolean, reverse:boolean = false) => {
    if (reverse) setTextStates((prevTextStates) => ({...prevTextStates, IDs: {...prevTextStates.IDs, [`${index}_${subIndex}`]:!val}}))
    else setTextStates((prevTextStates) => ({...prevTextStates, IDs: {...prevTextStates.IDs, [`${index}_${subIndex}`]:val}}))
  }

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
        setTextStates((prevTextStates) => ({...prevTextStates, globalID:prevTextStates.globalID+1}))
        data.message.forEach((m:Object, subIndex:number) => textStateSetter(textStates.globalID, subIndex, subIndex==0))
        setResults((prevResults) => [...prevResults, [text,data.message.map((record:Search) => {return {...record, title:ReplaceTitle(record.title)}})]])
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

  const makeText = (text:string,searches:Search[],index:number) => {
    return (
      <React.Fragment key={index}>
        <Flex direction="column-reverse" align="center" gap="2" order={-index}>
        {searches.map((search, subIndex) => (
          <Flex key={`${index}_${subIndex}`} direction="column" alignItems="center" gap = "2" bg={subIndex%2 ? "gray.200" : "gray.100"} borderRadius="10" p="3" position="relative">
            <Text key={`${index}_${subIndex}_index`} position="absolute" top="0.35rem" left="0.35rem" fontWeight="700" fontSize="xl" color={subIndex==0?"yellow.500":"gray.500"}>#{subIndex+1}</Text>
            <Text key={`${index}_${subIndex}_title`} fontWeight="600" align="center" maxW="80%">{search["title"]} </Text>
            <Text id={`${index}_${subIndex}}_text`} key={`${index}_${subIndex}_text`} cursor="pointer" backgroundColor={subIndex % 2 ? 'gray.50' : 'white'} borderRadius="lg" p="1rem" onClick={() => textStateSetter(index, subIndex, textStates.IDs[`${index}_${subIndex}`],true)}>
                ... {textStates.IDs[`${index}_${subIndex}`]==true?search["text"]:search["text"].substring(0,200)} ...
                <span className={`float-right text-gray-500 hover:text-gray-600 ${textStates.IDs[`${index}_${subIndex}`] ? "invisible" : ""}`}> (Click for More) </span>
            </Text>
            <Text key={`${index}_${subIndex}_time`} alignItems="end" color="gray.500" onClick={() => OpenLink(search)}> 
              <span className={`flex hover:cursor-pointer justify-between ${subIndex % 2 ? 'bg-gray-50 hover:bg-white' : 'bg-white hover:bg-white'} p-1 rounded-lg`}>
                <Image src="/images/Youtube.svg" height={32} width={32} alt="YouTube Logo"/> 
                {secondsToHour(search["start"])} - {secondsToHour(search["end"])}
              </span>
            </Text>
          </Flex>
        ))}
        <Text key={`${index}_main`} m="2" fontSize="lg">{text}</Text>
        </Flex>
      </React.Fragment>
    )}

  return (
      <ChakraProvider>
        <Container maxW="1000px" my="5">
          <Flex direction="column-reverse" wrap="wrap-reverse" justifyContent="flex-start" align="center" gap="5" minH="calc(100vh - 5rem)">
            <Container id="main" textAlign="center">
              <Input placeholder="Send a question" value={text} onChange={(e) => setText(e.target.value)} onKeyUp={(event) => {if (event.key ==="Enter") sendRequest()}} p="1.5rem"/>
            </Container>
            <div id="mainContainer" className="max-h-screen max-w-[60%] overflow-auto mt-3">
              <Flex direction="column-reverse" justifyContent="flex-start" align = "center" gap="5">
                {results.map(([text,searches],index) => makeText(text,searches,index))}
              </Flex>
            </div>
          </Flex>
        </Container>
      </ChakraProvider>
)}


{/* <Container id="main" position="sticky" bottom="0" z-index="10" bg="black">
  <Input placeholder="Send a question" onChange={(e) => setText(e.target.value)} onKeyUp={(event) => {if (event.key ==="Enter") sendRequest()}} p="1.5rem" my="1rem"/>
</Container> */}