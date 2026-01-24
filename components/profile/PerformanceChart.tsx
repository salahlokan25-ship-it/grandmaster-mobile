import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Polyline, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { PerformanceData, PerformancePoint } from '@/types/chess';

interface PerformanceChartProps {
    data: PerformanceData;
    height?: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, height = 150 }) => {
    const screenWidth = Dimensions.get('window').width - 64; // Horizontal padding
    const padding = 20;

    const allPoints = [...data.aiHistory, ...data.onlineHistory];
    if (allPoints.length === 0) return null;

    const minRating = Math.min(...allPoints.map(p => p.rating)) - 50;
    const maxRating = Math.max(...allPoints.map(p => p.rating)) + 50;
    const range = maxRating - minRating;

    const getPath = (points: PerformancePoint[]) => {
        if (points.length < 2) return '';
        const stepX = (screenWidth - padding * 2) / (points.length - 1);

        return points.map((p, i) => {
            const x = padding + i * stepX;
            const y = height - padding - ((p.rating - minRating) / range) * (height - padding * 2);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    const aiPath = getPath(data.aiHistory);
    const onlinePath = getPath(data.onlineHistory);

    return (
        <View className="bg-stone-900/40 p-4 rounded-3xl border border-white/5">
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row gap-4">
                    <View className="flex-row items-center gap-2">
                        <View className="w-2 h-2 rounded-full bg-amber-500" />
                        <Text className="text-white/60 text-xs font-semibold uppercase tracking-tighter">Online</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <View className="w-2 h-2 rounded-full bg-blue-500" />
                        <Text className="text-white/60 text-xs font-semibold uppercase tracking-tighter">AI Coach</Text>
                    </View>
                </View>
                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Progress Trace</Text>
            </View>

            <View style={{ height, width: screenWidth }}>
                <Svg height={height} width={screenWidth}>
                    <Defs>
                        <LinearGradient id="gradientOnline" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#f59e0b" stopOpacity="0.2" />
                            <Stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                        </LinearGradient>
                        <LinearGradient id="gradientAI" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#3b82f6" stopOpacity="0.2" />
                            <Stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Grid Lines */}
                    {[0, 0.5, 1].map((v, i) => (
                        <Line
                            key={i}
                            x1={padding}
                            y1={padding + v * (height - padding * 2)}
                            x2={screenWidth - padding}
                            y2={padding + v * (height - padding * 2)}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* AI Line */}
                    <Path
                        d={aiPath}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Online Line */}
                    <Path
                        d={onlinePath}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* End Points */}
                    {data.onlineHistory.length > 0 && (
                        <Circle
                            cx={padding + (data.onlineHistory.length - 1) * ((screenWidth - padding * 2) / (data.onlineHistory.length - 1))}
                            cy={height - padding - ((data.onlineHistory[data.onlineHistory.length - 1].rating - minRating) / range) * (height - padding * 2)}
                            r="4"
                            fill="#f59e0b"
                        />
                    )}
                </Svg>
            </View>
        </View>
    );
};
