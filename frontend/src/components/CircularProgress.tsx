
interface CircularProgressProps {
    percentage: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    color?: string;
    showText?: boolean;
}

export function CircularProgress({
    percentage,
    size = 40,
    strokeWidth = 3,
    color, // if not provided, calculates based on percentage
    showText = true,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    // Dynamic color based on score if not provided
    const getColor = (p: number) => {
        if (color) return color;
        if (p >= 85) return '#10b981'; // emerald-500
        if (p >= 70) return '#fbbf24'; // amber-400
        return '#f97316'; // orange-500
    };

    const strokeColor = getColor(percentage);

    return (
        <div className="relative flex items-center justify-center p-1" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg
                className="transform -rotate-90 w-full h-full"
                viewBox={`0 0 ${size} ${size}`}
            >
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />

                {/* Progress Circle */}
                <circle
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-1000 ease-out drop-shadow-sm"
                />
            </svg>

            {showText && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className="text-[10px] font-bold"
                        style={{ color: strokeColor }}
                    >
                        %{percentage}
                    </span>
                </div>
            )}
        </div>
    );
}
