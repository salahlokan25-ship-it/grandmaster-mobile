import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { PerformanceData, PerformancePoint } from '@/types/chess';

interface PerformanceChartProps {
    data: PerformanceData;
    height?: number;
    title?: string;
    lineColor?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
    data,
    height = 180,
    title = "Performance Trend",
    lineColor = "#f59e0b"
}) => {
    const screenWidth = Dimensions.get('window').width - 64;
    const padding = 20;

    const points = data.onlineHistory; // Defaulting to one line for simplicity in specific charts
    if (!points || points.length === 0) {
        return (
            <View className="bg-stone-900/40 p-8 rounded-[32px] border border-white/5 items-center justify-center">
                <Text className="text-white/20 font-black uppercase tracking-widest text-xs">No Data Available</Text>
            </View>
        );
    }

    const ratings = points.map(p => p.rating);
    const minRating = Math.min(...ratings) - 20;
    const maxRating = Math.max(...ratings) + 20;
    const range = maxRating - minRating;

    const getCoordinates = (p: PerformancePoint, i: number) => {
        const x = padding + i * ((screenWidth - padding * 2) / (points.length - 1 || 1));
        const y = height - padding - ((p.rating - minRating) / (range || 1)) * (height - padding * 2);
        return { x, y };
    };

    const coords = points.map((p, i) => getCoordinates(p, i));

    const getBezierPath = (coords: { x: number, y: number }[]) => {
        if (coords.length < 2) return '';

        let path = `M ${coords[0].x} ${coords[0].y}`;

        for (let i = 0; i < coords.length - 1; i++) {
            const curr = coords[i];
            const next = coords[i + 1];
            const cp1x = curr.x + (next.x - curr.x) / 2;
            const cp1y = curr.y;
            const cp2x = curr.x + (next.x - curr.x) / 2;
            const cp2y = next.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }

        return path;
    };

    const pathData = getBezierPath(coords);
    const areaPath = points.length >= 2
        ? `${pathData} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`
        : '';

    return (
        <View className="bg-stone-900/40 p-6 rounded-[40px] border border-white/5 shadow-2xl">
            <View className="flex-row items-center justify-between mb-6">
                <View>
                    <Text className="text-white font-black text-sm lowercase italic">{title}</Text>
                    <Text className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-0.5">Live Analytics</Text>
                </View>
                <View className="bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <Text className="text-white font-bold text-[10px] tracking-tighter">
                        {points[points.length - 1].rating} ELO
                    </Text>
                </View>
            </View>

            <View style={{ height, width: screenWidth }}>
                <Svg height={height} width={screenWidth}>
                    <Defs>
                        <LinearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={lineColor} stopOpacity="0.15" />
                            <Stop offset="0.8" stopColor={lineColor} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Area fill */}
                    {areaPath !== '' && (
                        <Path d={areaPath} fill="url(#fillGradient)" />
                    )}

                    {/* Main Line */}
                    <Path
                        d={pathData}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {coords.map((c, i) => (
                        <Circle
                            key={i}
                            cx={c.x}
                            cy={c.y}
                            r="3"
                            fill="white"
                            stroke={lineColor}
                            strokeWidth="2"
                        />
                    ))}
                </Svg>
            </View>
        </View>
    );
};
