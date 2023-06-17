"use client"
import {useEffect} from "react";

export default function Home() {

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
          if (!res.ok) console.log(res)
          else return res.json() 
        })
        .then((data) => {
          console.log(data.message)
        })
        .catch(error => console.log(error))}, []
  )

  return (
    <div>
      test
    </div>
  )
}
