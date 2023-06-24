import { PineconeClient } from '@pinecone-database/pinecone';
import { HfInference } from "@huggingface/inference";

if (!process.env.ENV || !process.env.KEY || !process.env.HF_ACCESS_TOKEN || !process.env.PROJECTNAME || !process.env.INDEX) {
  throw new Error('Pinecone environment or api key vars missing');
}


const pinecone = new PineconeClient();
const inference = new HfInference(process.env.HF_ACCESS_TOKEN)

export async function initPinecone() {
    try {
  
      await pinecone.init({
        environment: process.env.ENV as string,
        apiKey: process.env.KEY as string,
      });
      return pinecone;
      
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to initialize Pinecone Client');
    }
  }

initPinecone()
pinecone.projectName=process.env.PROJECTNAME as string
const index = pinecone.Index(process.env.INDEX as string)

module.exports = {
    index : index,
    inference : inference
}