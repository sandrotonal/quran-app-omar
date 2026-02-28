import CryptoJS from 'crypto-js';

// Güvenli şifreleme için .env üzerinden gelen key veya fallback (prod ortamda mutlaka ENV kullanılmalıdır)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'kuran_app_secure_key_2024!#';

export class SecureStorage {
    /**
     * Veriyi şifreler ve LocalStorage'a kaydeder.
     * @param key Saklanacak anahtar
     * @param value Saklanacak veri (Obje veya string olabilir)
     */
    static setItem(key: string, value: any): void {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            const encryptedValue = CryptoJS.AES.encrypt(stringValue, ENCRYPTION_KEY).toString();
            localStorage.setItem(key, encryptedValue);
        } catch (error) {
            console.error('Storage encryption error:', error);
            // Fallback: Şifreleme başarısız olursa düz metin kaydet (güvenlik için riskli ama veri kaybını önler)
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
    }

    /**
     * LocalStorage'dan veriyi çeker ve şifresini çözer.
     * @param key Okunacak anahtar
     * @returns Çözülmüş veri veya null
     */
    static getItem<T>(key: string): T | null {
        try {
            const encryptedValue = localStorage.getItem(key);
            if (!encryptedValue) return null;

            // Şifrelenmemiş eski verilerle geriye dönük uyumluluk kontrolü (Opsiyonel)
            if (encryptedValue.startsWith('{') || encryptedValue.startsWith('[')) {
                return JSON.parse(encryptedValue) as T;
            }

            const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedString) {
                // Şifre çözülemezse ham veriyi dönmeye çalış (eski veriler için)
                return encryptedValue as unknown as T;
            }

            try {
                return JSON.parse(decryptedString) as T;
            } catch {
                return decryptedString as unknown as T;
            }
        } catch (error) {
            console.error('Storage decryption error:', error);
            return null;
        }
    }

    /**
     * İlgili anahtarı siler.
     * @param key Silinecek anahtar
     */
    static removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Tüm LocalStorage'ı temizler.
     */
    static clear(): void {
        localStorage.clear();
    }
}
