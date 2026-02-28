Bismillahirahmanirahim

# Quran Semantic Graph & Spiritual Compass

Modern NLP (Dogal Dil Isleme) teknikleri ve graph (ag) gorsellestirme algoritmalari kullanilarak Kur'an-i Kerim ayetleri arasindaki anlamsal iliskileri haritalandiran, ayni zamanda zenginlestirilmis Islami araclar ile donatilmis full-stack web / android uygulamasidir. 

Uygulama, "Glassmorphism" (cam efekti) tabanli premium bir arayuz tasarimina sahip olup, kullanici deneyimini puruzsuz animasyonlar ve karanlik/aydinlik mod destekleriyle ust seviyeye tasimaktadir.

## Temel Ozellikler

### Anlamsal Analiz (Semantic Search)
- **NLP Modeli:** Turkce dili icin optimize edilmis `sentence-transformers` modeli.
- **Benzerlik Algoritmasi:** Cosine similarity (Kosinus Benzerligi) yaklasimi ile ayetler arasi derin baglam iliskilerinin saptanmasi.
- **Node Graph:** React Flow entegrasyonu ile anlamsal iliskilerin interaktif ag haritasi uzerinde gorsellestirilmesi.

### İslami Araçlar (Keşfet Modülü)
Uygulamanın sol menüsünde veya mobil görünümde yer alan kapsamlı PWA modülleri:

- **Günün Akışı:** Ayet, hadis, esma ve tefekkür planlarını barındıran günlük manevi program.
- **Ramazan İklimi:** İftar ve sahur sayacı, fitre hesaplamaları, teravih vb. özel sezonluk takipçi.
- **Namaz Asistanı:** Cemaatle namaz skoru, istatistik analizi ve namazdayken kullanılabilecek telefon sessiz modu hatırlatıcısı.
- **Kaza Borcu Takibi:** Geçmiş namaz borçlarının uçtan uca senkron halinde eksiltilerek takip edilmesi.
- **Hatim Takip Sistemi:** Cüz bazlı liste işareti, radial ilerleme arayüzü ve akıllı hatim asistanı.
- **Kuran Dinleme Modu:** Spotify/Apple Music tarzı glow (glow) animasyonlarıyla bezeli Arapça okuyuculu müzikçalar.
- **Dua Defteri:** Sadece kendinizin erişebileceği manevi notların kilit efektiyle şifreli bir depoda tutulması.
- **Zikirmatik:** Tıklama, hedef tayin etme, günlük çizgi (streak) ve ilerleme takip edilebilen premium bir UI sayacı.
- **Sessiz Zikir Modu:** OLED ekranlara özel derin siyahlar barındıran, PWA title (üst çerçeve) rengine kadar ekranı siyahlaştıran, sadece titreşim odaklı ve dikkati dağıtmayan minimal zikir deneyimi.
- **Esmâü'l Hüsnâ:** Allah'ın 99 isminin anlam derinliklerinin harita/liste formunda sunulması.
- **Dini Günler ve Kandiller:** Geri sayım widget'ları, o güne özel hadis ve ibadet önerileri barındıran İslami takvim okuyucusu.
- **Yakın Camiler:** Cihaz GPS bağlantısı kullanarak kullanıcının etrafındaki namazgah/camileri harita ikonografi biçiminde interaktif çıkarma.
- **Kıble Pusulası:** Gerçek zamanlı jiroskop verisiyle Mekke istikametini bulmanızı sağlayan pusula aracı.
- **Kabe Canlı Yayın:** Mescid-i Haram'dan 7/24 aralıksız YouTube tabanlı canlı yayın oynatıcı.
- **İstatistik (Manevi Pano):** Kullanıcının Kur'an, namaz ve zikirde harcadığı vakit/odak grafiklerini gösteren gösterge paneli.

## Proje Mimarisi

```text
kuran/
├── embedding-service/   # Python Flask embedding microservice (Port: 5000)
├── backend/             # Node.js Express API (Port: 3001)
└── frontend/            # React + TypeScript + Vite frontend (Port: 5173)
```

## Kurulum Adimlari

Sistemin tam anlamiyla islevsel olabilmesi icin asagidaki 3 servisin ayri terminallerde baslatilmasi gerekmektedir.

### 1. Python Embedding Service
Anlamsal arama (Semantic Search) ozelliginin calismasi icin NLP servisinin aktif olmasi sarttir. Ilk calistirmada yaklasik 500MB boyutundaki BERT NLP modeli otomatik olarak indirilecektir.

```bash
cd embedding-service
pip install -r requirements.txt
python app.py
```

### 2. Backend (Node.js API)
Veritabanina ve dis servislere erisimi saglayan ana API katmani.

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend (React PWA)
Kullanici arayuzunu sunan React istemcisi.

```bash
cd frontend
npm install
npm run dev
```

Tüm servisler baslatildiktan sonra `http://localhost:5173` adresi uzerinden uygulamaya erisebilirsiniz.

## Kullanilan Teknolojiler

**Frontend:**
- React 18, TypeScript, Vite
- Tailwind CSS (Premium Glassmorphism & Animations)
- React Flow (Ayet Ag Gorsellestirme)
- TanStack Query
- Lucide React (Ikonografi)

**Backend:**
- Node.js, Express
- SQLite (Veritabani yapilanmasi ve Onbellekleme sistemi)
- Axios

**Yapay Zeka / NLP Servisi:**
- Python 3, Flask
- sentence-transformers (BERT Modeli)
- Model: `emrecan/bert-base-turkish-cased-mean-nli-stsb-tr`

## Onemli Not (Akademik Yasal Uyari)

Bu uygulamada kullanilan anlamsal (semantic) bag kurma islemleri, NLP tabanli matematiksel otomatik hesaplamalara (Cosine Similarity) dayanmaktadir. Cikan benzerlik skorlari veya grafiksel iliskiler asla dogrudan bir "tefsir" veya "fetva" yerine gecmez. Yalnizca dilbilimsel yaklasimi gosteren arastirma amaci tasimaktadir.

## Lisans

MIT Lisansi altinda yayimlanmistir.
