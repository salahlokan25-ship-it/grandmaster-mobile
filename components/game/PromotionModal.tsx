import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { PieceType, PieceColor } from '../../types/chess';
import { ChessPiece } from './ChessPiece';
import { cn } from '../../lib/utils';

interface PromotionModalProps {
    visible: boolean;
    color: PieceColor;
    onSelect: (type: PieceType) => void;
}

export function PromotionModal({ visible, color, onSelect }: PromotionModalProps) {
    const pieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/60 items-center justify-center p-6">
                <View className="bg-stone-900 w-full max-w-sm rounded-[44px] p-8 border border-amber-500/30 items-center shadow-2xl">
                    <Text className="text-white text-2xl font-black italic lowercase tracking-tight mb-2">Promotion</Text>
                    <Text className="text-white/40 text-center font-bold text-[10px] uppercase tracking-[3px] mb-8">
                        Choose your reinforcement
                    </Text>

                    <View className="flex-row flex-wrap justify-center gap-4">
                        {pieces.map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => onSelect(type)}
                                className="bg-stone-800 w-24 h-24 rounded-3xl items-center justify-center border border-white/5 active:bg-amber-500/20 active:border-amber-500/50"
                            >
                                <ChessPiece type={type} color={color} size={48} />
                                <Text className="text-white/40 text-[8px] uppercase font-black tracking-widest mt-2">{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
