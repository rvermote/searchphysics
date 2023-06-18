"use client"
import {useEffect,useState} from "react";
import {ChakraProvider,Input,Container,Text,extendTheme} from "@chakra-ui/react";

const themeConfig = {initialColorMode: 'dark', useSystemColorMode: false}

export default function Home() {

  const [text, setText] = useState<string>("")

  useEffect(() => {
    fetch("/api/pineconeRequest", {
      method: "POST",
      body: JSON.stringify({question: "What is phase space?"}),
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
          console.log(data.message)
        })
        .catch(error => console.log(error))}, []
  )

  return (
  <div>
    <ChakraProvider theme={extendTheme({initialColorMode: 'dark', useSystemColorMode: false})}>
      <Container id="main" textAlign="center" maxW="600px" mt={12}>
        <Input placeholder="Send a question" onChange={(e) => setText(e.target.value)} />
      </Container>
    </ChakraProvider>
  </div>
)}
