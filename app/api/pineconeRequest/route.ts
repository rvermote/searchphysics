import {NextResponse} from 'next/server';
const { index, inference } =  require("@/components/serverstartup")

export async function POST(request: Request){
    try{
        let data = await request.json()
        console.log(data)
        let output = await inference.featureExtraction({model:"flax-sentence-embeddings/all_datasets_v3_mpnet-base",
        inputs: data.question})
        let req = {queryRequest:{
            vector: output as number[],
            topK: 5,
            includeValues: false,
            includeMetadata: true
        }
        }

        let result = await index.query(req)
        let response = result["matches"]?.map((item:any) => item.metadata)
        
        return NextResponse.json({message:response},{status:200})
    }catch(error){
        return NextResponse.json({message:error},{status:500})
    }

}