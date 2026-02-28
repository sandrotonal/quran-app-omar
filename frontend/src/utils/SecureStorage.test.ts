import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SecureStorage } from './SecureStorage';

describe('SecureStorage', () => {
    beforeEach(() => {
        // Clear mock location before each test
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should securely encrypt and decrypt strings', () => {
        const key = 'test-string-key';
        const value = 'my-secret-token';

        SecureStorage.setItem(key, value);

        // Assert it is stored
        const storedValue = localStorage.getItem(key);
        expect(storedValue).toBeDefined();
        // Assert it is actually encrypted (not plain text)
        expect(storedValue).not.toContain(value);

        // Assert decryption logic
        const retrievedValue = SecureStorage.getItem<string>(key);
        expect(retrievedValue).toBe(value);
    });

    it('should securely encrypt and decrypt complex objects', () => {
        const key = 'test-object-key';
        const testObject = { id: 1, name: 'Kuran App', isActive: true, nested: { value: 42 } };

        SecureStorage.setItem(key, testObject);

        // Assert it's stored and encrypted
        const rawStorage = localStorage.getItem(key);
        expect(rawStorage).toBeDefined();
        expect(rawStorage).not.toContain('Kuran App');

        // Retrieve and expect type preservation
        const retrievedObj = SecureStorage.getItem<typeof testObject>(key);
        expect(retrievedObj).toBeDefined();
        expect(retrievedObj?.id).toBe(1);
        expect(retrievedObj?.name).toBe('Kuran App');
        expect(retrievedObj?.nested.value).toBe(42);
    });

    it('should return null for non-existent keys', () => {
        const retrieved = SecureStorage.getItem<string>('missing_key');
        expect(retrieved).toBeNull();
    });

    it('should correctly remove items', () => {
        const key = 'delete-me';
        SecureStorage.setItem(key, 'val');

        expect(SecureStorage.getItem(key)).not.toBeNull();

        SecureStorage.removeItem(key);

        expect(SecureStorage.getItem(key)).toBeNull();
    });

    it('should safely fall back or attempt parsing corrupted/unencrypted data gracefully', () => {
        // Mock a scenario where data was saved plainly before encryption update
        localStorage.setItem('legacy_data', JSON.stringify({ old: 'data' }));

        // Ensure SecureStorage can still read old unencrypted JS structures seamlessly
        const retrievedLegacy = SecureStorage.getItem<{ old: string }>('legacy_data');
        expect(retrievedLegacy?.old).toBe('data');
    });
});
