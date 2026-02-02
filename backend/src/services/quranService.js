import axios from 'axios';
import { insertAyet, getAyet, getAllAyetler } from '../db/index.js';

// Diyanet Açık Kaynak Kur'an API
const BASE_URL = 'https://api.acikkuran.com';
const DIYANET_AUTHOR_ID = 11; // Diyanet İşleri Başkanlığı

// Fallback API (Al Quran Cloud - Uthmani script)
const FALLBACK_API_URL = 'http://api.alquran.cloud/v1/ayah';

export async function fetchAyetFromAPI(sureNo, ayetNo) {
    try {
        console.log(`Fetching ayet ${sureNo}:${ayetNo} from Diyanet API...`);

        // Fetch translations (includes all authors)
        const response = await axios.get(`${BASE_URL}/surah/${sureNo}/verse/${ayetNo}/translations`);

        // Find Diyanet translation
        const diyanetTranslation = response.data.data.find(t => t.author.id === DIYANET_AUTHOR_ID);

        if (!diyanetTranslation) {
            throw new Error('Diyanet translation not found');
        }

        let arabicText = '';
        let turkishText = diyanetTranslation.text;

        // Try getting Arabic from Diyanet API
        try {
            const verseResponse = await axios.get(`${BASE_URL}/surah/${sureNo}/verse/${ayetNo}`);
            arabicText = verseResponse.data.data.verse.text;
        } catch (err) {
            console.warn(`Diyanet Arabic fetch failed: ${err.message}`);
        }

        // If Arabic text is empty/missing, use Fallback API
        if (!arabicText) {
            console.log(`Arabic text missing for ${sureNo}:${ayetNo}, trying fallback API...`);
            try {
                const fallbackResponse = await axios.get(`${FALLBACK_API_URL}/${sureNo}:${ayetNo}/quran-uthmani`);
                arabicText = fallbackResponse.data.data.text;
                console.log('Fetched Arabic from Fallback API successfully.');
            } catch (fallbackErr) {
                console.error('Fallback API failed too:', fallbackErr.message);
                arabicText = 'Arapça metin yüklenemedi.'; // Last resort
            }
        }

        console.log(`Fetched successfully - Turkish (Diyanet): ${turkishText.substring(0, 50)}...`);

        return {
            sure_no: sureNo,
            ayet_no: ayetNo,
            arabic_text: arabicText,
            turkish_text: turkishText
        };
    } catch (error) {
        console.error(`API error for ${sureNo}:${ayetNo}:`, error.response?.data || error.message);
        throw new Error(`API error: ${error.message}`);
    }
}

export async function fetchOrCacheAyet(sureNo, ayetNo) {
    let ayet = getAyet(sureNo, ayetNo);

    if (!ayet || !ayet.arabic_text) { // Re-fetch if cached but arabic missing
        console.log(`Ayet ${sureNo}:${ayetNo} not in cache (or missing arabic), fetching from API...`);
        const apiData = await fetchAyetFromAPI(sureNo, ayetNo);

        // Update or insert
        insertAyet(sureNo, ayetNo, apiData.arabic_text, apiData.turkish_text);
        ayet = getAyet(sureNo, ayetNo);
        console.log('Ayet cached successfully');
    } else {
        console.log(`Ayet ${sureNo}:${ayetNo} found in cache`);
    }

    return ayet;
}

export async function fetchAllAyets() {
    const cached = getAllAyetler();

    if (cached.length > 0) {
        return cached;
    }

    console.log('Fetching all ayets from API... This may take a while.');
    const allAyets = [];

    for (let sure = 1; sure <= 114; sure++) {
        const maxAyet = getMaxAyetForSure(sure);

        for (let ayet = 1; ayet <= maxAyet; ayet++) {
            try {
                const data = await fetchOrCacheAyet(sure, ayet);
                allAyets.push(data);

                if (allAyets.length % 100 === 0) {
                    console.log(`Fetched ${allAyets.length} ayets...`);
                }
            } catch (error) {
                console.error(`Error fetching ${sure}:${ayet}`, error.message);
            }
        }
    }

    return allAyets;
}

function getMaxAyetForSure(sureNo) {
    const ayetCounts = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6];
    return ayetCounts[sureNo - 1] || 0;
}
