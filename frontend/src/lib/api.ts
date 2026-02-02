import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Ayet {
    id: number;
    sure_no: number;
    ayet_no: number;
    arabic_text: string;
    turkish_text: string;
}

export interface SimilarAyet {
    sure: number;
    ayet: number;
    similarityScore: number;
    text: string;
    arabic: string;
}

export interface SimilarResponse {
    center: {
        sure: number;
        ayet: number;
        text: string;
        arabic: string;
    };
    similar: SimilarAyet[];
}

export async function getAyet(sure: number, ayet: number): Promise<Ayet> {
    const response = await axios.get(`${API_URL}/api/ayet/${sure}/${ayet}`);
    return response.data;
}

export async function getSimilarAyets(
    sure: number,
    ayet: number,
    limit: number = 8
): Promise<SimilarResponse> {
    const response = await axios.post(`${API_URL}/api/ayet/similar`, {
        sure,
        ayet,
        limit
    });
    return response.data;
}
