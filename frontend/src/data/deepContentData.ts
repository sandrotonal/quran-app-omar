
import { AyetDeepInfo } from '../lib/deepContentService';

// This acts as our "Database" for now.
// In a real app, this would be fetched from a Supabase table: `ayet_deep_content`

export const DEEP_CONTENT_DATABASE: Record<string, AyetDeepInfo> = {
    // ------------------- FATİHA SURESİ (1) -------------------
    "1:1": {
        question: "Bu sonsuz merhametin kaynağı kim?",
        concepts: [
            { word: "Rahman", root: "R-H-M", meaning: "Özü itibariyle şefkatli, ayırt etmeden rızık veren." },
            { word: "Rahim", root: "R-H-M", meaning: "İradesiyle merhamet eden, karşılık veren." }
        ],
        tone: 'gratitude',
        modernContext: "Her işe O'nun adıyla başlama bilinci.",
        opposition: "Tesadüf ve sahipsizlik fikri",
        chain: { next: "1:2", nuance: "Bu merhametin sahibini tanıyalım" }
    },
    "1:2": {
        question: "Övgü neden sadece O'na aittir?",
        concepts: [
            { word: "Hamd", root: "H-M-D", meaning: "İsteğe bağlı iyiliğe karşı duyulan övgü ve teşekkür." },
            { word: "Rab", root: "R-B-B", meaning: "Eğiten, büyüten, kemale erdiren efendi." }
        ],
        tone: 'gratitude',
        modernContext: "Evrenin sahipsiz değil, terbiye edilen bir okul olduğu.",
        chain: { next: "1:3", nuance: "O Rabbin sıfatları nelerdir?" }
    },
    "1:3": {
        question: "O'nun terbiyesi nasıl bir terbiyedir?",
        concepts: [
            { word: "Rahman", root: "R-H-M", meaning: "Kuşatıcı şefkat." }
        ],
        tone: 'glad_tidings',
        chain: { next: "1:4", nuance: "Peki bu şefkat hesap sormaz mı?" }
    },
    "1:4": {
        question: "Hesap günü kime sığınacağız?",
        concepts: [
            { word: "Din Günü", root: "D-Y-N", meaning: "Karşılık günü, borçların ödendiği gün." },
            { word: "Malik", root: "M-L-K", meaning: "Mutlak sahip ve hükümdar." }
        ],
        tone: 'warning',
        modernContext: "Sorumsuzluk çağına bir hatırlatma: Hesap var.",
        chain: { next: "1:5", nuance: "Böyle bir Melik'e karşı duruşumuz ne olmalı?" }
    },
    "1:5": {
        question: "Özgürlük kime kul olmaktır?",
        concepts: [
            { word: "İbadet", root: "A-B-D", meaning: "Boyun eğmek, itaat etmek, köle olmak." },
            { word: "İstiane", root: "A-W-N", meaning: "Sadece O'ndan yardım dilemek." }
        ],
        tone: 'guiding',
        modernContext: "İnsanın kula kul olmaktan kurtuluş beyannamesi.",
        chain: { next: "1:6", nuance: "O'ndan en öncelikli ne istemeliyiz?" }
    },
    "1:6": {
        question: "Hangi yolda yürümek istiyoruz?",
        concepts: [
            { word: "Sırat", root: "S-R-T", meaning: "Geniş ve apaçık yol." },
            { word: "Müstakim", root: "K-W-M", meaning: "Dosdoğru, pürüzsüz, dengeli." }
        ],
        tone: 'prayer',
        modernContext: "Aşırılıklardan uzak, dengeli bir yaşam talebi.",
        chain: { next: "1:7", nuance: "Bu yolun somut örnekleri kimlerdir?" }
    },
    "1:7": {
        question: "Kimlerin izinden gitmeliyiz?",
        concepts: [
            { word: "Nimet", root: "N-A-M", meaning: "Konfor, iyilik, hidayet." },
            { word: "Dalalet", root: "D-L-L", meaning: "Yolu şaşırmak, kaybolmak." }
        ],
        tone: 'prayer',
        chain: { next: "2:1", nuance: "İşte o hidayet rehberi başlıyor..." }
    },

    // ------------------- BAKARA SURESİ (2) -------------------
    "2:1": {
        question: "Bu harflerin sırrı nedir?",
        concepts: [
            { word: "Elif Lam Mim", root: "-", meaning: "Hürufu Mukatta. Manası Allah ile Resulü arasındadır. 'Dikkat et, dinle' uyarısıdır." }
        ],
        tone: 'warning',
        modernContext: "Bilginin sınırlarını kabul etmek ve tevazu.",
        chain: { next: "2:2", nuance: "Bu dikkat çağrısından sonra gelen kitap..." }
    },
    "2:2": {
        question: "Hangi kitapta şüphe yoktur?",
        concepts: [
            { word: "Rayb", root: "R-Y-B", meaning: "Huzursuzluk veren şüphe, güvensizlik." },
            { word: "Hüda", root: "H-D-Y", meaning: "Yol gösteren rehber, kılavuz." },
            { word: "Müttaki", root: "W-K-Y", meaning: "Korunan, sorumluluk bilinci taşıyan." }
        ],
        tone: 'guiding',
        modernContext: "Hakikat arayışında güvenilecek tek kaynak.",
        chain: { next: "2:3", nuance: "Bu korunan insanların özellikleri neler?" }
    },
    "2:3": {
        question: "Görmeden inanmak ne kazandırır?",
        concepts: [
            { word: "Gayb", root: "G-Y-B", meaning: "Duyularla algılanamayan akıl ve kalp ile bilinen gerçeklik." },
            { word: "Salat", root: "S-L-W", meaning: "Namaz, dua, destek olmak." },
            { word: "İnfak", root: "N-F-K", meaning: "Tüketmek değil, paylaşarak çoğaltmak." }
        ],
        tone: 'guiding',
        modernContext: "Maddeci dünyaya karşı manevi bir duruş.",
        chain: { next: "2:4", nuance: "İnançları sadece bugünü mü kapsar?" }
    },
    "2:4": {
        question: "Vahyin sürekliliğine inanıyor musunuz?",
        concepts: [
            { word: "Ahiret", root: "A-K-R", meaning: "Sonraki hayat, asıl varış yeri." },
            { word: "Yakin", root: "Y-K-N", meaning: "Kesin, şüphesiz bilgi ve inanç." }
        ],
        tone: 'guiding',
        modernContext: "Tarihsel mirasa ve geleceğe bütüncül bakış.",
        chain: { next: "2:5", nuance: "Böyle inananların akıbeti nedir?" }
    },
    "2:5": {
        question: "Gerçek kurtuluş nedir?",
        concepts: [
            { word: "Felah", root: "F-L-H", meaning: "Engelleri yarıp çıkmak, çiftçinin ürünü elde etmesi gibi başarı." }
        ],
        tone: 'glad_tidings',
        modernContext: "Başarıyı sadece dünya ile sınırlamamak.",
    }
};
