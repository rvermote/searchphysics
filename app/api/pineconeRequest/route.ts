import {NextResponse} from 'next/server';
import pinecone, {initializePinecone} from "@/components/pinecone"



export async function POST(request: Request){

    try{
        const data = await request.json()
        await initializePinecone()
        const index = pinecone.Index(process.env.INDEX as string)
        const queryEmbedding = await getEmbeddings(data)

        const queryRequest= {
            vector: queryEmbedding,
            topK: 5,
            includeValues: true,
            includeMetadata: true
        }

        const result = await index.query(queryRequest)

        let response = result["matches"]?.map((item:any) => {item["metadata"].text})
        return NextResponse.json({message:response},{status:200})
    }catch(error){
        return NextResponse.json({message:error},{status:500})
    }

}