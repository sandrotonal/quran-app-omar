import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_DIR = join(__dirname, '../../data');
const AYAT_FILE = join(DB_DIR, 'ayetler.json');
const EMBEDDINGS_FILE = join(DB_DIR, 'embeddings.json');

import { mkdirSync } from 'fs';
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

function loadJSON(filepath) {
  if (!existsSync(filepath)) {
    writeFileSync(filepath, JSON.stringify([]));
    return [];
  }
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

function saveJSON(filepath, data) {
  writeFileSync(filepath, JSON.stringify(data, null, 2));
}

export function getAyet(sureNo, ayetNo) {
  const ayetler = loadJSON(AYAT_FILE);
  return ayetler.find(a => a.sure_no === sureNo && a.ayet_no === ayetNo);
}

export function insertAyet(sureNo, ayetNo, arabicText, turkishText) {
  const ayetler = loadJSON(AYAT_FILE);

  const existing = ayetler.find(a => a.sure_no === sureNo && a.ayet_no === ayetNo);
  if (existing) return { changes: 0 };

  const newAyet = {
    id: ayetler.length + 1,
    sure_no: sureNo,
    ayet_no: ayetNo,
    arabic_text: arabicText,
    turkish_text: turkishText
  };

  ayetler.push(newAyet);
  saveJSON(AYAT_FILE, ayetler);
  return { changes: 1 };
}

export function getAllAyetler() {
  return loadJSON(AYAT_FILE);
}

export function getEmbedding(ayetId) {
  const embeddings = loadJSON(EMBEDDINGS_FILE);
  return embeddings.find(e => e.ayet_id === ayetId);
}

export function insertEmbedding(ayetId, embeddingVector) {
  const embeddings = loadJSON(EMBEDDINGS_FILE);

  const existing = embeddings.find(e => e.ayet_id === ayetId);
  if (existing) {
    existing.embedding_vector = JSON.stringify(embeddingVector);
    existing.created_at = new Date().toISOString();
  } else {
    embeddings.push({
      id: embeddings.length + 1,
      ayet_id: ayetId,
      embedding_vector: JSON.stringify(embeddingVector),
      created_at: new Date().toISOString()
    });
  }

  saveJSON(EMBEDDINGS_FILE, embeddings);
  return { changes: 1 };
}

export function getAllEmbeddings() {
  return loadJSON(EMBEDDINGS_FILE);
}
