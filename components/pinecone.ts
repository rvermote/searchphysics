import {PineconeClient} from "@pinecone-database/pinecone"

const pinecone = new PineconeClient()

export const initializePinecone = async () => {
    await pinecone.init({
        environment: process.env.ENV as string,
        apiKey: process.env.KEY as string
    })
}

export default pinecone