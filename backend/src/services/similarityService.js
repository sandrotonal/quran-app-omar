import { getAllAyetler, getAllEmbeddings } from '../db/index.js';
import { getOrCreateEmbedding } from './embeddingService.js';

export function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have same dimension');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function findSimilarAyets(targetAyetId, targetText, limit = 8, threshold = 0.65) {
    const targetEmbedding = await getOrCreateEmbedding(targetAyetId, targetText);

    const allAyets = getAllAyetler();
    const similarities = [];

    for (const ayet of allAyets) {
        if (ayet.id === targetAyetId) continue;

        try {
            const ayetEmbedding = await getOrCreateEmbedding(ayet.id, ayet.turkish_text);
            const similarity = cosineSimilarity(targetEmbedding, ayetEmbedding);

            if (similarity >= threshold) {
                similarities.push({
                    ...ayet,
                    similarityScore: similarity
                });
            }
        } catch (error) {
            console.error(`Error calculating similarity for ayet ${ayet.id}:`, error.message);
        }
    }

    similarities.sort((a, b) => b.similarityScore - a.similarityScore);

    return similarities.slice(0, limit);
}
