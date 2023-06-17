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
      test
    </div>
  )
}
