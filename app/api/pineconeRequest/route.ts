import {NextResponse} from 'next/server';
import pinecone,{initPinecone} from "@/config/pinecone"
import { HfInference } from "@huggingface/inference";

initPinecone()
pinecone.projectName="youtube-search"
const index = pinecone.Index(process.env.INDEX as string)

const inference = new HfInference(process.env.HF_ACCESS_TOKEN)

export async function POST(request: Request){
    const data = await request.json()
    const output = await inference.featureExtraction({model:"flax-sentence-embeddings/all_datasets_v3_mpnet-base",
    inputs: data.question})
    const req = {queryRequest:{
        vector: output as number[],
        topK: 5,
        includeValues: true,
        includeMetadata: true
    }
    }

    const result = await index.query(req)
    console.log(result)
    try{
        const data = await request.json()

        const queryEmbedding = await inference.featureExtraction({model:"flax-sentence-embeddings/all_datasets_v3_mpnet-base",
        inputs: data.question})

        const req = {queryRequest:{
            vector: queryEmbedding as number[],
            topK: 5,
            includeValues: true,
            includeMetadata: true
        }
        }

        const result = await index.query(req)

        let response = result["matches"]?.map((item:any) => {item["metadata"].text})
        return NextResponse.json({message:response},{status:200})
    }catch(error){
        return NextResponse.json({message:error},{status:500})
    }

}