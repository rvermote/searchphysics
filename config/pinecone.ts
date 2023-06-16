import { PineconeClient } from '@pinecone-database/pinecone';

if (!process.env.ENV || !process.env.KEY) {
  throw new Error('Pinecone environment or api key vars missing');
}

const pinecone = new PineconeClient();

export async function initPinecone() {
  try {

    await pinecone.init({
      environment: process.env.ENV ?? '',
      apiKey: process.env.KEY ?? '',
    });

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

export default pinecone