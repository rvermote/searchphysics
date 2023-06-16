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
      }).then((res) => {if (!res.ok) console.log(res)
                        else console.log(res.body)})}, []
  )

  return (
    <div>
      test
    </div>
  )
}
