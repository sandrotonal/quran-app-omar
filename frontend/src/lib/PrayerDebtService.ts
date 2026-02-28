export type PrayerType = 'sabah' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi' | 'vitir';

import { SecureStorage } from '../utils/SecureStorage';

export interface PrayerDebt {
    type: PrayerType;
    count: number;
}

const STORAGE_KEY = 'prayer_debts';

const DEFAULT_DEBTS: PrayerDebt[] = [
    { type: 'sabah', count: 0 },
    { type: 'ogle', count: 0 },
    { type: 'ikindi', count: 0 },
    { type: 'aksam', count: 0 },
    { type: 'yatsi', count: 0 },
    { type: 'vitir', count: 0 },
];

export const PrayerDebtService = {
    // Add a helper method to get default debts, as the new getDebts logic uses it
    getDefaultDebts(): PrayerDebt[] {
        return DEFAULT_DEBTS;
    },

    getDebts(): PrayerDebt[] {
        try {
            // Use SecureStorage.getItem, no JSON.parse needed as SecureStorage handles serialization
            const stored = SecureStorage.getItem<PrayerDebt[]>(STORAGE_KEY);
            if (stored) {
                // Merge with defaults to ensure all types exist if schema changes
                return DEFAULT_DEBTS.map(def => {
                    const found = stored.find((p: PrayerDebt) => p.type === def.type);
                    return found ? found : def;
                });
            }
        } catch (error) {
            console.error("Failed to load prayer debts:", error);
        }
        return DEFAULT_DEBTS;
    },

    saveDebts(debts: PrayerDebt[]) {
        try {
            // Use SecureStorage.setItem, no JSON.stringify needed as SecureStorage handles serialization
            SecureStorage.setItem(STORAGE_KEY, debts);
            // Trigger a custom event so other components can update if needed
            window.dispatchEvent(new Event('prayer-debt-update'));
        } catch (error) {
            console.error("Failed to save prayer debts:", error);
        }
    },

    updateDebt(type: PrayerType, delta: number) {
        const debts = this.getDebts();
        const newDebts = debts.map(d => {
            if (d.type === type) {
                return { ...d, count: Math.max(0, d.count + delta) };
            }
            return d;
        });
        this.saveDebts(newDebts);
        return newDebts;
    },

    // Calculate total debt for bulk adding (e.g., "I missed 1 year")
    addYearlyDebt(years: number) {
        const days = years * 365;
        const debts = this.getDebts();
        const newDebts = debts.map(d => ({
            ...d,
            count: d.count + days
        }));
        this.saveDebts(newDebts);
        return newDebts;
    },

    getLabel(type: PrayerType): string {
        const labels: Record<PrayerType, string> = {
            'sabah': 'Sabah',
            'ogle': 'Öğle',
            'ikindi': 'İkindi',
            'aksam': 'Akşam',
            'yatsi': 'Yatsı',
            'vitir': 'Vitir'
        };
        return labels[type];
    }
};
