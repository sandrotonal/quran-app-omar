// Gün bazlı içerik rotasyon servisi
// Amacı: Her gün aynı sıradaki içeriği vermek, ancak gün değiştiğinde içeriği de değiştirmektir.
// Rastgelelik (Math.random) yerine UTC gününe göre hesaplama yapar. Böylece bildirimlerde çıkan günün ayeti ile
// ManeviAkis sayfasındaki günün ayeti tam olarak eşleşir.

const VERSES = [
    { text: "Rabbin seni terk etmedi ve sana darılmadı.", source: "Duha Suresi, 3. Ayet", arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ" },
    { text: "Rabbin, kendisinden başkasına asla ibadet etmemenizi, anaya-babaya iyi davranmanızı kesin olarak emretti.", source: "İsra Suresi, 23. Ayet", arabic: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا" },
    { text: "Şüphesiz Allah, adaleti, iyilik yapmayı, yakınlara yardım etmeyi emreder.", source: "Nahl Suresi, 90. Ayet", arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ" },
    { text: "Ey iman edenler! Sabır ve namazla (Allah'tan) yardım dileyin. Şüphesiz Allah, sabredenlerle beraberdir.", source: "Bakara Suresi, 153. Ayet", arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ" },
    { text: "Kim zerre ağırlığınca bir hayır işlerse, onun mükâfatını görecektir.", source: "Zilzal Suresi, 7. Ayet", arabic: "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ" },
    { text: "Kalpler ancak Allah'ı anmakla huzur bulur.", source: "Ra'd Suresi, 28. Ayet", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ" },
    { text: "Bilsin ki insan için kendi çalışmasından başka bir şey yoktur.", source: "Necm Suresi, 39. Ayet", arabic: "وَأَنْ لَيْسَ لِلْإِنْسَانِ إِلَّا مَا سَعَىٰ" },
    { text: "O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır.", source: "Mülk Suresi, 2. Ayet", arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا" }
];

const HADITHS = [
    { text: "Müminlerin iman yönünden en kâmil olanı, ahlâkı en güzel olanıdır.", source: "Müslim, İman 95" },
    { text: "Sizin en hayırlınız, Kur'an'ı öğrenen ve öğreteninizdir.", source: "Buhârî, Fezâilü'l-Kur'an 21" },
    { text: "İki nimet vardır ki insanların çoğu o nimetlerin değerini bilmez: Sağlık ve boş vakit.", source: "Buhârî, Rikak 1" },
    { text: "Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.", source: "Buhârî, İlim 11" },
    { text: "Kim bir Müslümanın dünya sıkıntılarından birini giderirse, Allah da onun kıyamet günündeki sıkıntılarından birini giderir.", source: "Müslim, Zikir 38" },
    { text: "Ameller niyetlere göredir. Herkese niyet ettiği şey vardır.", source: "Buhârî, Bed'ü'l-vahy 1" }
];

const ESMAS = [
    { arabic: "اَلْوَدُودُ", turkish: "El-Vedûd", meaning: "Çok seven ve çok sevilen" },
    { arabic: "اَلرَّحْمٰنُ", turkish: "Er-Rahmân", meaning: "Dünyada bütün mahlûkata merhamet eden" },
    { arabic: "اَلرَّحِيمُ", turkish: "Er-Rahîm", meaning: "Ahirette müminlere sonsuz ikramda bulunan" },
    { arabic: "اَلسَّلَامُ", turkish: "Es-Selâm", meaning: "Her türlü eksiklikten münezzeh, selamet veren" },
    { arabic: "اَللَّطِيفُ", turkish: "El-Latîf", meaning: "Lütuf ve ihsan sahibi, her şeyin inceliğini bilen" },
    { arabic: "اَلرَّزَّاقُ", turkish: "Er-Rezzâk", meaning: "Rızkı veren ve ihtiyaçları karşılayan" }
];

const TEFEKKURS = [
    { title: "Zamanın Bereketi", text: "Sadece bir an için dur. Aldığın nefesin, görebildiğin renklerin bir lütuf olduğunu hatırla. Bugün en son ne zaman içtenlikle 'Elhamdülillah' dedin?" },
    { title: "Tebessüm Sadakadır", text: "Bugün karşılaştığın birine içten bir şekilde gülümsedin mi? Kendi sıkıntılarına rağmen bir başkasının gününü aydınlatmak, ruhunu nasıl hafifletirdi düşün." },
    { title: "Kainatın Dili", text: "Dışarı çık ve sadece bir ağacın yaprağına bak. Hiçbir çizgisinin tesadüf olmadığını, eşsiz bir sanatla işlendiğini düşün. O yaprağı canlandıran kudretin, senin de kalbini bildiğini hatırla." },
    { title: "Kelimelerin Gücü", text: "Ağzından çıkan her söz, ya bir iyilik tohumu eker ya da bir yara açar. Bugün kurduğun cümlelerde ne sıklıkla şükür ve sevgi vardı?" }
];

const MISSIONS = [
    { title: "Sadaka Ver", description: "Miktarı hiç önemli değil; bugün bir ihtiyaç sahibine veya kuruma bağışta bulun." },
    { title: "Akraba Ziyareti / Araması", description: "Uzun zamandır görüşmediğin bir büyüğünü veya akrabanı ara, hal hatır sor." },
    { title: "Bir Sure Ezberle", description: "Kur'an'dan kısa bir surenin veya ayetin anlamına odaklan, onu ezberlemeye çalış." },
    { title: "Gülümse ve Selam Ver", description: "Bugün karşılaştığın tanıdıklarına veya iş arkadaşlarına içten bir tebessümle selam ver." },
    { title: "Tövbe İstiğfar", description: "Günün yorgunluğunu atmak için sessiz bir köşede 100 defa 'Estağfirullah' çekip tefekkür et." }
];

export class DailyContentService {
    /**
     * Günün UTC bazlı endeksini hesaplar (Böylece 24 saatte bir değişir)
     */
    private static getDailyIndex(arrayLength: number): number {
        // Unix epoch time gün sayısı (1 Gün = 86400000ms)
        // Türkiye saati dikkate alınarak (UTC+3) ofset eklenebilir ama UTC de yeterlidir.
        const daysSinceEpoch = Math.floor((Date.now() + 3 * 3600000) / 86400000);
        return daysSinceEpoch % arrayLength;
    }

    public static getDailyVerse() {
        const index = this.getDailyIndex(VERSES.length);
        return VERSES[index];
    }

    public static getDailyHadith() {
        const index = this.getDailyIndex(HADITHS.length);
        return HADITHS[index];
    }

    public static getDailyEsma() {
        const index = this.getDailyIndex(ESMAS.length);
        return ESMAS[index];
    }

    public static getDailyTefekkur() {
        const index = this.getDailyIndex(TEFEKKURS.length);
        return TEFEKKURS[index];
    }

    public static getDailyMission() {
        const index = this.getDailyIndex(MISSIONS.length);
        return MISSIONS[index];
    }
}
