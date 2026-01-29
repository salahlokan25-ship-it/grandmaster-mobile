import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, User, Calendar, Target, Clock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuthStore } from '../stores/authStore';

export default function OnboardingScreen() {
    const router = useRouter();
    const { updateProfile, profile } = useAuthStore();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        displayName: '',
        ageRange: '',
        experienceLevel: '',
        playFrequency: '',
    });

    const ageRanges = ['Under 18', '18-25', '26-35', '36-50', '50+'];
    const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const playFrequencies = ['Daily', 'Weekly', 'Monthly', 'Rarely'];

    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);

        try {
            // Update profile with Supabase
            await updateProfile({
                display_name: formData.displayName,
            });

            // Navigate to home screen
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error('Error in onboarding submission:', error);
            setLoading(false);
            alert('Something went wrong. Please try again.');
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.displayName.trim().length > 0;
            case 2:
                return formData.ageRange !== '';
            case 3:
                return formData.experienceLevel !== '';
            case 4:
                return formData.playFrequency !== '';
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Animated.View entering={FadeInDown} className="flex-1 justify-center px-8">
                        <View className="items-center mb-12">
                            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                                <User size={40} color="#f59e0b" />
                            </View>
                            <Text className="text-3xl font-bold text-foreground mb-3">What's your name?</Text>
                            <Text className="text-muted-foreground text-center">
                                This will be displayed on your profile
                            </Text>
                        </View>

                        <TextInput
                            placeholder="Enter your display name"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            className="bg-card border border-border/50 p-5 rounded-2xl text-white text-lg mb-6"
                            value={formData.displayName}
                            onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                            autoFocus
                        />
                    </Animated.View>
                );

            case 2:
                return (
                    <Animated.View entering={FadeInDown} className="flex-1 justify-center px-8">
                        <View className="items-center mb-12">
                            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                                <Calendar size={40} color="#f59e0b" />
                            </View>
                            <Text className="text-3xl font-bold text-foreground mb-3">Your age range?</Text>
                            <Text className="text-muted-foreground text-center">
                                Helps us personalize your experience
                            </Text>
                        </View>

                        <View className="gap-3">
                            {ageRanges.map((range) => (
                                <TouchableOpacity
                                    key={range}
                                    onPress={() => setFormData({ ...formData, ageRange: range })}
                                    className={`p-5 rounded-2xl border-2 ${formData.ageRange === range
                                        ? 'bg-primary/20 border-primary'
                                        : 'bg-card border-border/50'
                                        }`}
                                >
                                    <Text
                                        className={`text-lg font-bold text-center ${formData.ageRange === range ? 'text-primary' : 'text-foreground'
                                            }`}
                                    >
                                        {range}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                );

            case 3:
                return (
                    <Animated.View entering={FadeInDown} className="flex-1 justify-center px-8">
                        <View className="items-center mb-12">
                            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                                <Target size={40} color="#f59e0b" />
                            </View>
                            <Text className="text-3xl font-bold text-foreground mb-3">Chess experience?</Text>
                            <Text className="text-muted-foreground text-center">
                                We'll match you with appropriate content
                            </Text>
                        </View>

                        <View className="gap-3">
                            {experienceLevels.map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setFormData({ ...formData, experienceLevel: level })}
                                    className={`p-5 rounded-2xl border-2 ${formData.experienceLevel === level
                                        ? 'bg-primary/20 border-primary'
                                        : 'bg-card border-border/50'
                                        }`}
                                >
                                    <Text
                                        className={`text-lg font-bold text-center ${formData.experienceLevel === level ? 'text-primary' : 'text-foreground'
                                            }`}
                                    >
                                        {level}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                );

            case 4:
                return (
                    <Animated.View entering={FadeInDown} className="flex-1 justify-center px-8">
                        <View className="items-center mb-12">
                            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
                                <Clock size={40} color="#f59e0b" />
                            </View>
                            <Text className="text-3xl font-bold text-foreground mb-3">How often do you play?</Text>
                            <Text className="text-muted-foreground text-center">
                                Last question! We're almost done
                            </Text>
                        </View>

                        <View className="gap-3">
                            {playFrequencies.map((frequency) => (
                                <TouchableOpacity
                                    key={frequency}
                                    onPress={() => setFormData({ ...formData, playFrequency: frequency })}
                                    className={`p-5 rounded-2xl border-2 ${formData.playFrequency === frequency
                                        ? 'bg-primary/20 border-primary'
                                        : 'bg-card border-border/50'
                                        }`}
                                >
                                    <Text
                                        className={`text-lg font-bold text-center ${formData.playFrequency === frequency ? 'text-primary' : 'text-foreground'
                                            }`}
                                    >
                                        {frequency}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                );
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Progress Indicator */}
            <View className="px-8 pt-4 pb-8">
                <View className="flex-row gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <View
                            key={i}
                            className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-border/30'
                                }`}
                        />
                    ))}
                </View>
                <Text className="text-muted-foreground text-sm mt-3">
                    Step {step} of 4
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {renderStep()}
            </ScrollView>

            {/* Navigation */}
            <View className="px-8 pb-8">
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!canProceed() || loading}
                    className={`p-5 rounded-2xl flex-row items-center justify-center ${canProceed() && !loading ? 'bg-primary' : 'bg-border/30'
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className={`font-bold text-lg mr-2 ${canProceed() ? 'text-white' : 'text-muted-foreground'}`}>
                                {step === 4 ? 'Get Started' : 'Continue'}
                            </Text>
                            <ChevronRight size={24} color={canProceed() ? 'white' : '#666'} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
