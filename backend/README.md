# Backend API

Node.js + Express backend for Quran Semantic Graph.

## Setup

```bash
npm install
```

## Environment Variables

Create `.env` file:

```env
PORT=3001
EMBEDDING_SERVICE_URL=http://localhost:5000
DIYANET_API_KEY=471|IUHKNzXzIwJYnjWFzAZgoz10teXaudkDdXwMPRRTf1abd9a1
```

## Run

```bash
npm run dev
```

## Project Structure

```
src/
├── app.js              # Express app setup
├── db/
│   └── index.js        # SQLite database
├── services/
│   ├── quranService.js      # Diyanet API
│   ├── embeddingService.js  # Embedding generation
│   └── similarityService.js # Cosine similarity
└── routes/
    └── ayet.js         # API endpoints
```

## API

### GET /api/ayet/:sure/:ayet

Fetch single ayet.

**Response:**
```json
{
  "id": 1,
  "sure_no": 2,
  "ayet_no": 286,
  "arabic_text": "...",
  "turkish_text": "..."
}
```

### POST /api/ayet/similar

Find similar ayets.

**Request:**
```json
{
  "sure": 2,
  "ayet": 286,
  "limit": 8
}
```

**Response:**
```json
{
  "center": {
    "sure": 2,
    "ayet": 286,
    "text": "...",
    "arabic": "..."
  },
  "similar": [
    {
      "sure": 94,
      "ayet": 5,
      "similarityScore": 0.87,
      "text": "...",
      "arabic": "..."
    }
  ]
}
```
