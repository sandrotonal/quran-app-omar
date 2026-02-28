import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrayerDebtService, PrayerType } from './PrayerDebtService';
import { SecureStorage } from '../utils/SecureStorage';

// Mock SecureStorage to prevent actual localStorage writes during testing
vi.mock('../utils/SecureStorage', () => ({
    SecureStorage: {
        getItem: vi.fn(),
        setItem: vi.fn()
    }
}));

describe('PrayerDebtService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return default debts when storage is empty', () => {
        vi.mocked(SecureStorage.getItem).mockReturnValue(null);

        const debts = PrayerDebtService.getDebts();

        expect(debts.length).toBe(6); // sabah, ogle, ikindi, aksam, yatsi, vitir
        expect(debts[0].type).toBe('sabah');
        expect(debts[0].count).toBe(0);
    });

    it('should retrieve existing debts correctly', () => {
        const mockStoredDebts = [
            { type: 'sabah' as PrayerType, count: 5, label: 'Sabah' },
            { type: 'ogle' as PrayerType, count: 2, label: 'Öğle' }
        ];

        vi.mocked(SecureStorage.getItem).mockReturnValue(mockStoredDebts);

        const debts = PrayerDebtService.getDebts();

        const sabahDebt = debts.find(d => d.type === 'sabah');
        expect(sabahDebt?.count).toBe(5);

        // Even though only 2 were stored, the service should merge defaults for the rest
        expect(debts.length).toBe(6);
        const ikindiDebt = debts.find(d => d.type === 'ikindi');
        expect(ikindiDebt?.count).toBe(0);
    });

    it('should save debts using SecureStorage', () => {
        const debtsToSave = PrayerDebtService.getDefaultDebts();
        debtsToSave[0].count = 10; // set sabah to 10

        // Mock window.dispatchEvent which is called in saveDebts
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);

        PrayerDebtService.saveDebts(debtsToSave);

        expect(SecureStorage.setItem).toHaveBeenCalledWith('prayer_debts', debtsToSave);
        expect(dispatchSpy).toHaveBeenCalled();

        dispatchSpy.mockRestore();
    });
});
