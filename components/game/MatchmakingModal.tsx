import { View, Text, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Users, X, Wifi } from 'lucide-react-native';

interface MatchmakingModalProps {
    visible: boolean;
    onCancel: () => void;
}

export function MatchmakingModal({ visible, onCancel }: MatchmakingModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/80 items-center justify-center p-6">
                <View className="bg-card rounded-3xl p-6 w-full max-w-sm border border-border/50">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-xl font-bold text-foreground">Finding Opponent</Text>
                        <Pressable onPress={onCancel} className="w-8 h-8 items-center justify-center rounded-full bg-secondary">
                            <X size={20} color="hsl(30 10% 55%)" />
                        </Pressable>
                    </View>

                    {/* Searching Animation */}
                    <View className="items-center py-8">
                        <View className="mb-6 relative">
                            <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center">
                                <Users size={40} color="hsl(24 100% 45%)" />
                            </View>
                            <View className="absolute -top-2 -right-2">
                                <ActivityIndicator size="large" color="hsl(24 100% 45%)" />
                            </View>
                        </View>

                        <Text className="text-foreground font-semibold text-lg mb-2">Searching for players...</Text>
                        <Text className="text-muted-foreground text-center text-sm mb-6">
                            Looking for an opponent at your skill level
                        </Text>

                        {/* Info Box */}
                        <View className="w-full bg-secondary/50 rounded-xl p-4 border border-border/30">
                            <View className="flex-row items-start gap-3">
                                <View className="mt-0.5">
                                    <Wifi size={20} color="hsl(24 100% 45%)" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-semibold text-primary uppercase mb-1">Coming Soon</Text>
                                    <Text className="text-sm text-muted-foreground">
                                        Online multiplayer will be available after app launch. Real-time matchmaking with players worldwide!
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Cancel Button */}
                    <Pressable
                        onPress={onCancel}
                        className="w-full py-3 bg-secondary rounded-xl items-center active:bg-secondary/80"
                    >
                        <Text className="text-foreground font-semibold">Cancel Search</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
