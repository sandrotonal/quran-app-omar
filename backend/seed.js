import { fetchOrCacheAyet } from './src/services/quranService.js';

console.log('🌱 Seeding database with sample ayets...\n');

// Popüler ayetler - hızlı test için
const sampleAyets = [
    { sure: 1, ayet: 1 },   // Fatiha
    { sure: 2, ayet: 255 }, // Ayetül Kürsi
    { sure: 2, ayet: 286 }, // Bakara son
    { sure: 3, ayet: 26 },  // Dua
    { sure: 3, ayet: 173 }, // Dua
    { sure: 5, ayet: 114 }, // Dua
    { sure: 7, ayet: 23 },  // Dua
    { sure: 7, ayet: 126 }, // Dua
    { sure: 10, ayet: 2 },
    { sure: 10, ayet: 10 }, // Dua
    { sure: 14, ayet: 40 }, // Dua
    { sure: 17, ayet: 24 }, // Dua
    { sure: 17, ayet: 80 }, // Dua
    { sure: 20, ayet: 25 }, // Dua
    { sure: 23, ayet: 29 }, // Dua
    { sure: 25, ayet: 65 }, // Dua
    { sure: 26, ayet: 83 }, // Dua
    { sure: 28, ayet: 16 }, // Dua
    { sure: 112, ayet: 1 }, // İhlas
    { sure: 113, ayet: 1 }, // Felak
    { sure: 114, ayet: 1 }  // Nas
];

async function seed() {
    let successCount = 0;
    let errorCount = 0;

    for (const { sure, ayet } of sampleAyets) {
        try {
            await fetchOrCacheAyet(sure, ayet);
            successCount++;
            console.log(`✅ ${sure}:${ayet} cached`);

            // Rate limiting - API'yi patlatmamak için
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            errorCount++;
            console.error(`❌ ${sure}:${ayet} failed:`, error.message);
        }
    }

    console.log(`\n✨ Seeding complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${errorCount}`);
    console.log(`\nNow you can test similar ayets with queries like:`);
    console.log(`   Sure: 2, Ayet: 286`);

    process.exit(0);
}

seed().catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
});
