# Quran Semantic Graph & Spiritual Compass

Modern NLP ve graph visualization kullanarak Kur'an ayetleri arasındaki anlamsal ilişkileri görselleştiren, aynı zamanda manevi odak ve Esmaül Hüsna gibi özelliklerle zenginleştirilmiş full-stack web uygulaması.

## 🌟 Özellikler

### 🔍 Anlamsal Analiz (Semantic Search)
- **NLP Modeli**: Türkçe optimize edilmiş `sentence-transformers` modeli.
- **Benzerlik**: Cosine similarity ile ayetler arası derin bağlam ilişkileri.
- **Graph**: React Flow ile interaktif ağ haritası.

### 🕌 Manevi Özellikler
- **Esmaül Hüsna**: Allah'ın 99 isminin doğru sıralaması, anlamları ve ebced değerleri.
- **Manevi Odak**: Namaz vakitlerine göre değişen, ayet ve hadis tabanlı manevi motivasyon kartları.
- **Namaz Vakitleri**: Konum tabanlı, Diyanet uyumlu namaz vakitleri takibi.
- **Karanlık Mod**: Göz yormayan, modern arayüz tasarımı.

## 🛠️ Proje Yapısı

```
kuran/
├── embedding-service/   # Python Flask embedding microservice (Port: 5000)
├── backend/             # Node.js Express API (Port: 3001)
└── frontend/            # React + Vite frontend (Port: 5173)
```

## 🚀 Kurulum Adımları

Sistemin tam çalışması için 3 servisin de ayağa kalkması gerekmektedir.

### 1. Python Embedding Service (Zorunlu)
Anlamsal arama özelliğinin çalışması için bu servis arkada açık olmalıdır.

```bash
cd embedding-service
pip install -r requirements.txt
python app.py
```
*İlk çalıştırmada ~500MB boyutunda NLP modeli (BERT) indirilecektir.*

### 2. Backend (Node.js)

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## 🎨 Kullanım

1.  Tüm servisleri sırasıyla başlatın.
2.  `http://localhost:5173` adresine gidin.
3.  **Arama**: Sure ve ayet numarası girerek veya konu aratarak benzer ayetleri keşfedin.
4.  **Manevi Odak**: Ana sayfadaki kart üzerinden o anki vakte özel mesajı okuyun.
5.  **Esmaül Hüsna**: Yan menüden Esmaül Hüsna listesine ulaşın.

## 🔧 Teknolojiler

**Frontend:**
- React 18, TypeScript, Vite
- Tailwind CSS (Modern UI)
- React Flow (Graph Visualization)
- TanStack Query

**Backend:**
- Node.js, Express
- SQLite (Veritabanı & Cache)
- Axios

**AI / NLP Service:**
- Python, Flask
- sentence-transformers (BERT Model)
- Model: `emrecan/bert-base-turkish-cased-mean-nli-stsb-tr`

## ⚠️ Akademik Not

Bu uygulama NLP tabanlı otomatik hesaplama kullanır. Benzerlik skorları tefsir yerine geçmez, yalnızca matematiksel ve dilbilimsel yakınlığı gösterir.

## 📜 Lisans

MIT
