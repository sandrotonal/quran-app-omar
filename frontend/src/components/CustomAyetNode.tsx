import { Handle, Position, NodeProps } from '@xyflow/react';

interface AyetNodeData {
    label: string;
    text: string;
    arabic: string;
    isCenter: boolean;
    similarityScore?: number;
}

export function CustomAyetNode({ data }: NodeProps<AyetNodeData>) {
    const { label, text, arabic, isCenter, similarityScore } = data;

    return (
        <div
            className={`
        relative group
        ${isCenter
                    ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 border-[3px] border-amber-400 shadow-2xl shadow-emerald-900/50'
                    : 'bg-gradient-to-br from-teal-500 via-emerald-500 to-emerald-600 border-2 border-emerald-400/50 shadow-xl shadow-emerald-900/30'
                }
        text-white rounded-2xl px-5 py-4 min-w-[160px] max-w-[240px]
        hover:scale-110 hover:z-50 hover:shadow-2xl
        transition-all duration-300 cursor-pointer
        backdrop-blur-sm
      `}
        >
            {/* Decorative corner */}
            {isCenter && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs">⭐</span>
                </div>
            )}

            {/* Islamic geometric pattern overlay */}
            <div className="absolute inset-0 opacity-10 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]"></div>
            </div>

            <Handle type="target" position={Position.Top} className="!bg-amber-400 !border-2 !border-white !w-3 !h-3" />

            <div className="text-center relative z-10">
                {/* Sure:Ayet Label */}
                <div className={`
          font-bold mb-3 pb-2 border-b-2 border-white/30
          ${isCenter ? 'text-xl' : 'text-lg'}
        `}>
                    <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                        {label}
                    </span>
                </div>

                {/* Similarity Badge */}
                {!isCenter && similarityScore && (
                    <div className="mb-3">
                        <span className="inline-block bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            %{(similarityScore * 100).toFixed(0)} benzer
                        </span>
                    </div>
                )}

                {/* Arabic Text */}
                {arabic && (
                    <div
                        className="text-sm opacity-95 mb-2 font-arabic leading-relaxed px-2 py-2 bg-white/10 rounded-lg backdrop-blur-sm"
                        dir="rtl"
                        style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                    >
                        {arabic.substring(0, 45)}{arabic.length > 45 ? '...' : ''}
                    </div>
                )}

                {/* Turkish Preview */}
                <div className="text-[11px] opacity-80 leading-snug italic px-1">
                    "{text.substring(0, 60)}{text.length > 60 ? '...' : ''}"
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !border-2 !border-white !w-3 !h-3" />

            {/* Glow effect on hover */}
            <div className={`
        absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100
        ${isCenter ? 'shadow-[0_0_30px_rgba(251,191,36,0.5)]' : 'shadow-[0_0_20px_rgba(16,185,129,0.4)]'}
      `}></div>
        </div>
    );
}
