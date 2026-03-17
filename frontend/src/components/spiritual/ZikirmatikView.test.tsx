import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ZikirmatikView } from './ZikirmatikView';
import { SecureStorage } from '../../utils/SecureStorage';

// Mock Lucide-react icons because they don't render well in basic JSDOM without proper transforms 
// and we don't need them for logic testing
vi.mock('lucide-react', () => ({
    RefreshCcw: () => <div data-testid="icon-refresh">Refresh</div>,
    Save: () => <div data-testid="icon-save">Save</div>,
    Trash2: () => <div data-testid="icon-trash">Trash</div>,
    Plus: () => <div data-testid="icon-plus">Plus</div>,
    GripVertical: () => <div data-testid="icon-grip">Grip</div>,
    Settings2: () => <div data-testid="icon-settings">Settings</div>,
    Sparkles: () => <div data-testid="icon-sparkles">Sparkles</div>,
    ChevronDown: () => <div data-testid="icon-chevron">Chevron</div>,
    Volume2: () => <div data-testid="icon-volume">Volume</div>,
    VolumeX: () => <div data-testid="icon-volume-x">Muted</div>,
    X: () => <div data-testid="icon-x">Close</div>
}));

// Mock the haptic constant object entirely
vi.mock('../../lib/constants', () => ({
    hapticFeedback: vi.fn()
}));

// Mock SecureStorage to intercept saves
vi.mock('../../utils/SecureStorage', () => ({
    SecureStorage: {
        getItem: vi.fn(),
        setItem: vi.fn()
    }
}));


describe('ZikirmatikView Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('confirm', vi.fn(() => true)); // Mock window.confirm for happy-dom
        vi.stubGlobal('navigator', { vibrate: vi.fn() }); // Mock navigator.vibrate just in case

        // Setup initial default mock returns for SecureStorage
        vi.mocked(SecureStorage.getItem).mockImplementation((key) => {
            if (key === 'zikir_count') return 0;
            if (key === 'zikir_target') return 33;
            if (key === 'zikir_total_count') return 100;
            if (key === 'zikir_sound_enabled') return true;
            return null;
        });
    });

    it('should render initial state correctly (Count: 0, Target: 33)', () => {
        const mockOnClose = vi.fn();
        render(<ZikirmatikView onClose={mockOnClose} />);

        // Central count display should be 0
        const mainDisplay = screen.getByText('0', { selector: '.text-8xl' });
        expect(mainDisplay).toBeInTheDocument();

        // Target display 
        expect(screen.getByText('HEDEF: 33')).toBeInTheDocument();
    });

    it('should increment count when the large interaction area is clicked and trigger storage save', () => {
        const mockOnClose = vi.fn();
        render(<ZikirmatikView onClose={mockOnClose} />);

        // Find the main large ripple button/area covering the screen.
        // It's the div containing the word "DOKUN" (or similar) or we can grab it by aria-label / role
        // Because there's no aria role directly on the big div, we'll grab it by test-id or text inside
        // Let's use getByText 'DOKUN' which is hidden in sr-only but exists
        const touchArea = screen.getByText('Dokunarak zikret');

        // Simulating click (tapping)
        fireEvent.click(touchArea);

        // The counter should update to 1
        expect(screen.getByText('1', { selector: '.text-8xl' })).toBeInTheDocument();

        // Ensure that SecureStorage.setItem was called to save 'zikir_count'
        expect(SecureStorage.setItem).toHaveBeenCalledWith('zikir_count', 1);
        // Also it updates the total
        expect(SecureStorage.setItem).toHaveBeenCalledWith('zikir_total_count', 101); // 100 + 1
    });

    it('should reset the count when the refresh button is clicked', () => {
        // Mock that we already have 10 zikrs saved
        vi.mocked(SecureStorage.getItem).mockImplementation((key) => {
            if (key === 'zikir_count') return 10;
            if (key === 'zikir_target') return 33;
            return null;
        });

        render(<ZikirmatikView onClose={vi.fn()} />);

        // Confirm it rendered 10
        expect(screen.getByText('10', { selector: '.text-8xl' })).toBeInTheDocument();

        // Find and click refresh
        const refreshBtn = screen.getByTitle('Sıfırla');
        fireEvent.click(refreshBtn);

        // Verify count went back to 0
        expect(screen.getByText('0', { selector: '.text-8xl' })).toBeInTheDocument();
    });

    it('should show completion modal when target is reached', async () => {
        // Start at 32/33
        vi.mocked(SecureStorage.getItem).mockImplementation((key) => {
            if (key === 'zikir_count') return 32;
            if (key === 'zikir_target') return 33;
            return null;
        });

        render(<ZikirmatikView onClose={vi.fn()} />);

        const touchArea = screen.getByText('Dokunarak zikret');

        // 32 -> 33
        fireEvent.click(touchArea);

        // Success text should popup asynchronously
        expect(await screen.findByText('ELHAMDÜLİLLAH')).toBeInTheDocument();
    });

});
