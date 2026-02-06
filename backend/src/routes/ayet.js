import express from 'express';
import { fetchOrCacheAyet } from '../services/quranService.js';
import { findSimilarAyets } from '../services/similarityService.js';
import { getAyetMetadata } from '../db/index.js';

const router = express.Router();

router.get('/:sure/:ayet', async (req, res) => {
    try {
        const { sure, ayet } = req.params;
        const sureNo = parseInt(sure);
        const ayetNo = parseInt(ayet);

        if (isNaN(sureNo) || isNaN(ayetNo)) {
            return res.status(400).json({ error: 'Invalid sure or ayet number' });
        }

        const ayetData = await fetchOrCacheAyet(sureNo, ayetNo);

        if (!ayetData) {
            return res.status(404).json({ error: 'Ayet not found' });
        }

        const metadata = getAyetMetadata(sureNo, ayetNo);

        res.json({
            ...ayetData,
            metadata
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/similar', async (req, res) => {
    try {
        const { sure, ayet, limit = 8 } = req.body;

        console.log(`\n📊 Similarity request: ${sure}:${ayet}, limit: ${limit}`);

        if (!sure || !ayet) {
            return res.status(400).json({ error: 'Missing sure or ayet in request body' });
        }

        const centerAyet = await fetchOrCacheAyet(sure, ayet);

        if (!centerAyet) {
            return res.status(404).json({ error: 'Center ayet not found' });
        }

        console.log(`   Center ayet ID: ${centerAyet.id}`);
        console.log(`   Text: ${centerAyet.turkish_text.substring(0, 50)}...`);

        const similarAyets = await findSimilarAyets(
            centerAyet.id,
            centerAyet.turkish_text,
            limit
        );

        console.log(`   Found ${similarAyets.length} similar ayets`);
        if (similarAyets.length > 0) {
            console.log(`   Top similarity: ${similarAyets[0].similarityScore.toFixed(3)}`);
        }

        const centerMetadata = getAyetMetadata(sure, ayet);

        res.json({
            center: {
                sure: centerAyet.sure_no,
                ayet: centerAyet.ayet_no,
                text: centerAyet.turkish_text,
                arabic: centerAyet.arabic_text,
                metadata: centerMetadata
            },
            similar: similarAyets.map(a => ({
                sure: a.sure_no,
                ayet: a.ayet_no,
                similarityScore: a.similarityScore,
                text: a.turkish_text,
                arabic: a.arabic_text
            }))
        });
    } catch (error) {
        console.error(`❌ Similarity error:`, error.message);
        console.error(error.stack);
        res.status(500).json({ error: error.message });
    }
});

export default router;
