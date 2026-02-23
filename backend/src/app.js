import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ayetRoutes from './routes/ayet.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'quran-semantic-backend' });
});

app.use('/api/ayet', ayetRoutes);

// YouTube canlı yayın video ID proxy - kanal sayfasından aktif live video ID çeker
app.get('/api/youtube-live/:channelHandle', async (req, res) => {
    try {
        const { channelHandle } = req.params;
        const url = `https://www.youtube.com/${channelHandle}/live`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        const html = await response.text();

        // YouTube sayfasından video ID çıkar
        // Yöntem 1: canonical URL'den
        const canonicalMatch = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)"/);
        if (canonicalMatch) {
            return res.json({ videoId: canonicalMatch[1], source: 'canonical' });
        }

        // Yöntem 2: og:url meta tag'ından
        const ogMatch = html.match(/<meta property="og:url" content="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)"/);
        if (ogMatch) {
            return res.json({ videoId: ogMatch[1], source: 'og:url' });
        }

        // Yöntem 3: videoId pattern'inden
        const videoIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        if (videoIdMatch) {
            return res.json({ videoId: videoIdMatch[1], source: 'json' });
        }

        res.status(404).json({ error: 'No live stream found for this channel' });
    } catch (err) {
        console.error('YouTube live fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch live stream info' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
