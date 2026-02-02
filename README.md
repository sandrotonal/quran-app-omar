# Quran Semantic Graph

Modern NLP ve graph visualization kullanarak Kur'an ayetleri arasındaki anlamsal ilişkileri görselleştiren full-stack web uygulaması.

## Proje Yapısı

```
kuran/
├── embedding-service/   # Python Flask embedding microservice
├── backend/             # Node.js Express API
└── frontend/            # React + Vite frontend
```

## Özellikler

- Türkçe optimize NLP modeli (sentence-transformers)
- Cosine similarity ile anlamsal benzerlik hesaplama
- İnteraktif graph görselleştirme (React Flow)
- Dark mode desteği
- SQLite ile embedding cache
- Responsive UI

## Kurulum

### 1. Python Embedding Service

```bash
cd embedding-service
pip install -r requirements.txt
python app.py
```

İlk çalıştırmada ~500MB model indirilecek. Port: `5000`

### 2. Backend (Node.js)

```bash
cd backend
npm install
npm run dev
```

Port: `3001`

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Port: `5173`

## Kullanım

1. Tüm servisleri çalıştırın
2. http://localhost:5173 adresini açın
3. Sure ve ayet numarası girin (örn: Sure 2, Ayet 286)
4. "Benzer Ayetleri Göster" butonuna tıklayın
5. Graph üzerinde node'lara tıklayarak detay panelini açın

## API Endpoints

### Backend

- `GET /api/ayet/:sure/:ayet` - Tek ayet getir
- `POST /api/ayet/similar` - Benzer ayetler bul

### Embedding Service

- `GET /health` - Servis durumu
- `POST /embed` - Tek metin embedding
- `POST /embed/batch` - Toplu embedding

## Teknolojiler

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- Axios

**Embedding Service:**
- Python + Flask
- sentence-transformers
- Model: emrecan/bert-base-turkish-cased-mean-nli-stsb-tr

**Frontend:**
- React 18 + TypeScript
- Vite
- React Flow
- TanStack Query
- Tailwind CSS

## Akademik Not

Bu uygulama NLP tabanlı otomatik hesaplama kullanır. Benzerlik skorları tefsir yerine geçmez, yalnızca anlamsal yakınlık gösterir.

## Lisans

MIT
