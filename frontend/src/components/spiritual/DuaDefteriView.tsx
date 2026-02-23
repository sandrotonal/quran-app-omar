import { useEffect, useState } from 'react';
import { hapticFeedback } from '../../lib/constants';

interface DuaNote {
    id: string;
    text: string;
    date: string;
}

export function DuaDefteriView({ onClose }: { onClose: () => void }) {
    const [notes, setNotes] = useState<DuaNote[]>([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [newDua, setNewDua] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));

        const saved = localStorage.getItem('dua_defteri');
        const priv = localStorage.getItem('dua_defteri_private');
        if (saved) {
            try { setNotes(JSON.parse(saved)); } catch (e) { }
        }
        if (priv === 'true') {
            setIsPrivate(true);
            setIsLocked(true);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    const togglePrivate = () => {
        hapticFeedback(20);
        const next = !isPrivate;
        setIsPrivate(next);
        setIsLocked(next);
        localStorage.setItem('dua_defteri_private', next.toString());
    };

    const addDua = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDua.trim() || isLocked) return;
        hapticFeedback(10);
        const note: DuaNote = {
            id: Date.now().toString(),
            text: newDua,
            date: new Date().toLocaleDateString('tr-TR')
        };
        const next = [note, ...notes];
        setNotes(next);
        setNewDua('');
        localStorage.setItem('dua_defteri', JSON.stringify(next));
    };

    const deleteDua = (id: string) => {
        hapticFeedback([20, 20]);
        const next = notes.filter(n => n.id !== id);
        setNotes(next);
        localStorage.setItem('dua_defteri', JSON.stringify(next));
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
            <div
                className={`absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md transition-opacity duration-500 ease-out z-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div className={`relative w-full max-w-2xl h-[95vh] md:h-auto md:max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden
                bg-stone-50/90 dark:bg-[#0c0a09]/90 backdrop-blur-3xl
                border border-stone-200/50 dark:border-stone-800/50
                shadow-2xl shadow-stone-900/10 dark:shadow-stone-900/40 z-10
                transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
                ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-16 scale-95 opacity-0'}
            `}>

                {/* Vintage/Paper Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-stone-400/10 dark:bg-stone-500/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="px-6 py-6 md:px-10 md:py-8 flex items-center justify-between shrink-0 relative z-20 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-600 to-stone-800 dark:from-stone-700 dark:to-stone-900 flex items-center justify-center text-stone-100 shadow-lg shadow-stone-600/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 mb-0.5">Dua Defteri</h2>
                            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Kişisel Notalar</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={togglePrivate}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${isPrivate ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 shadow-sm' : 'bg-white dark:bg-white/5 text-stone-500 dark:text-stone-400 border-stone-200/50 dark:border-white/10 hover:bg-stone-50 md:dark:hover:bg-white/10'}`}
                        >
                            {isPrivate ? 'Özel Mod Açık' : 'Özel Mod'}
                        </button>
                        <button onClick={() => { hapticFeedback(10); handleClose(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10 transition-all active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar relative z-10 w-full mb-6">

                    {/* Input Area */}
                    <div className={`transition-all duration-300 ${isLocked ? 'opacity-50 pointer-events-none grayscale blur-sm' : ''}`}>
                        <form onSubmit={addDua} className="bg-white/60 dark:bg-black/40 border border-stone-200 dark:border-white/10 rounded-[2rem] p-4 shadow-xl backdrop-blur-md relative group flex flex-col focus-within:border-stone-400 dark:focus-within:border-stone-500 transition-colors">
                            <textarea
                                value={newDua}
                                onChange={(e) => setNewDua(e.target.value)}
                                placeholder="Rabbinize içten bir yakarış yazın..."
                                className="w-full bg-transparent border-none focus:ring-0 resize-none h-24 text-stone-800 dark:text-stone-200 placeholder:text-stone-400 p-2 font-serif text-lg custom-scrollbar leading-relaxed"
                            />
                            <div className="flex justify-between items-center px-2 mt-2">
                                <span className="text-xs font-semibold text-stone-400 tracking-wider">Bugün: {new Date().toLocaleDateString('tr-TR')}</span>
                                <button
                                    type="submit"
                                    disabled={!newDua.trim() || isLocked}
                                    className="px-6 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-stone-800 dark:hover:bg-white active:scale-95 shadow-md"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Locked State Overlay */}
                    {isLocked && (
                        <div className="relative z-20 mt-8">
                            <div className="bg-indigo-50/90 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800 rounded-[2rem] p-10 text-center shadow-2xl backdrop-blur-md max-w-sm mx-auto">
                                <div className="w-20 h-20 mx-auto bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-200 dark:border-indigo-700/50">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h3 className="font-bold font-serif text-xl text-indigo-950 dark:text-indigo-50 mb-3">Özel Mod Aktif</h3>
                                <p className="text-sm text-indigo-800/80 dark:text-indigo-200/70 mb-8 font-medium">Dualarınız şu anda gizlendi. Görüntülemek için kilidi açın.</p>
                                <button
                                    onClick={() => { hapticFeedback(20); setIsLocked(false); }}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-colors shadow-lg shadow-indigo-600/30 active:scale-95"
                                >
                                    Kilidi Aç
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notes List */}
                    <div className={`space-y-4 transition-all duration-500 ${isLocked ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                        {notes.length === 0 ? (
                            <div className="text-center py-12 text-stone-400 font-medium border-2 border-dashed border-stone-200 dark:border-white/5 rounded-[2rem]">
                                Henüz bir dua eklemediniz.<br />Kalbinizden geçenleri not alarak başlayın.
                            </div>
                        ) : (
                            notes.map(note => (
                                <div key={note.id} className="bg-white/80 dark:bg-black/60 border border-stone-200/50 dark:border-white/10 p-6 md:p-8 rounded-[1.5rem] relative group shadow-lg backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-black hover:shadow-xl hover:border-stone-300 dark:hover:border-white/20">
                                    {/* Paper texture grain line */}
                                    <div className="absolute left-6 inset-y-0 w-px bg-rose-200 dark:bg-rose-900/30 opacity-50" />

                                    <div className="pl-6 relative z-10">
                                        <p className="whitespace-pre-wrap text-stone-800 dark:text-stone-300 font-serif text-lg leading-relaxed">{note.text}</p>
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/50">
                                            <span className="text-xs text-stone-400 font-bold tracking-widest uppercase">{note.date}</span>
                                            <button
                                                onClick={() => deleteDua(note.id)}
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-red-500/50 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors active:scale-90"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
