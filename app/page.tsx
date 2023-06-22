"use client"
import {useEffect,useState} from "react";
import Image from "next/image";
import {ChakraProvider,Input,Container,Flex,extendTheme, Text} from "@chakra-ui/react";
import React from "react";
import {ReplaceTitle, secondsToHour} from "@/components/functions";
import {FaRegPaperPlane} from "react-icons/fa"

type Result = [string, Search[]]
type Search = {title:string, text:string, start:number, end:number, url:string}
type IDs = {[key:string]:boolean}
type TextState = {globalID : number, IDs : IDs}


export default function Home() {

  const [text, setText] = useState<string>("")
  const [results, setResults] = useState<Result[]>([])
  const [debounce, setDebounce] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [textStates,setTextStates] = useState<TextState>({globalID : 0, IDs : {test:false}})
  var youtubeWindow:any = null

  useEffect(() => {
    const mainContainer = document.getElementById("mainContainer")
    if (mainContainer) mainContainer.scrollTop = mainContainer.scrollHeight
  }, [results])

  const textStateSetter= (index:number, subIndex:number, val:boolean, reverse:boolean = false) => {
    if (reverse) setTextStates((prevTextStates) => ({...prevTextStates, IDs: {...prevTextStates.IDs, [`${index}_${subIndex}`]:!val}}))
    else setTextStates((prevTextStates) => ({...prevTextStates, IDs: {...prevTextStates.IDs, [`${index}_${subIndex}`]:val}}))
  }

  const fetchPinecone = async () => {fetch("/api/pineconeRequest", {
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
        setLoading(false)
      })
      .catch(error => {console.log(error); setLoading(false)})}


  const sendRequest = async () => {
    if (!debounce){
      setDebounce(true)
      setLoading(true)
      setText("")
      setTimeout(() => {setDebounce(false)}, 1000)
      await fetchPinecone()
    }
  }

  const OpenLink = (search:Search) => {
    let seconds = Math.max(0,search["start"]-5)
    let hours = Math.floor(seconds / 3600)
    let minutes = Math.floor((seconds - (hours * 3600)) / 60)
    let sec = seconds - (hours * 3600) - (minutes * 60)
    let link = "https://www.youtube.com/watch?v="+search["url"]+"&t="+hours+"h"+minutes+"m"+sec+"s"
    if(youtubeWindow as any && !youtubeWindow.closed){
      youtubeWindow.location.href=link
    }else{
      youtubeWindow = window.open(link,"_blank")
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
        <div className="max-h-screen p-[3rem]">
          <ChakraProvider>
            <Flex direction="column-reverse" wrap="wrap-reverse" justifyContent="flex-start" align="center" gap="5">
              <Container id="main" textAlign="center" position="relative" >
                <Input placeholder="Send a question" value={text} onChange={(e) => setText(e.target.value)} onKeyUp={(event) => {if (event.key ==="Enter" && !debounce && !loading) sendRequest()}} p="1.5rem" backgroundColor="gray.100"/>
                <FaRegPaperPlane color={!debounce && !loading ? "green" : "red"} onClick={() => {if(!debounce && !loading && text!="") sendRequest()} }className="hover:cursor-pointer text-xl absolute z-10 right-[2.3rem] top-[1rem]"/>
              </Container>
              <div id="mainContainer" className="max-h-[calc(100vh-10rem)] max-w-[600px] overflow-auto mt-3">
                <Flex direction="column-reverse" justifyContent="flex-start" align = "center" gap="5">
                  {results.map(([text,searches],index) => makeText(text,searches,index))}
                </Flex>
              </div>
            </Flex>
            </ChakraProvider>
        </div>
)}