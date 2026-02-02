import axios from 'axios';
import { getEmbedding, insertEmbedding } from '../db/index.js';

const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL || 'http://localhost:5000';

export async function generateEmbedding(text) {
    try {
        const response = await axios.post(`${EMBEDDING_SERVICE_URL}/embed`, {
            text: text
        });

        return response.data.embedding;
    } catch (error) {
        throw new Error(`Embedding service error: ${error.message}`);
    }
}

export async function getOrCreateEmbedding(ayetId, text) {
    let embedding = getEmbedding(ayetId);

    if (!embedding) {
        const embeddingVector = await generateEmbedding(text);
        insertEmbedding(ayetId, embeddingVector);
        embedding = getEmbedding(ayetId);
    }

    return JSON.parse(embedding.embedding_vector);
}

export async function batchGenerateEmbeddings(texts) {
    try {
        const response = await axios.post(`${EMBEDDING_SERVICE_URL}/embed/batch`, {
            texts: texts
        });

        return response.data.embeddings;
    } catch (error) {
        throw new Error(`Batch embedding service error: ${error.message}`);
    }
}
