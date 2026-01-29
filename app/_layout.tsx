import 'react-native-url-polyfill/auto';
import 'expo-standard-web-crypto';
import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Image, Text, Platform } from "react-native";
import { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay, runOnJS } from 'react-native-reanimated';
import { useAuthStore } from '../stores/authStore';

export default function RootLayout() {
    const [isSplashVisible, setSplashVisible] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const segments = useSegments();
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();

    // Splash Animation Values
    const scale = useSharedValue(0.3);
    const opacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const containerOpacity = useSharedValue(1);

    // App Entry Animation Values
    const appScale = useSharedValue(0.95);
    const appOpacity = useSharedValue(0);

    const triggerSplash = (onComplete?: () => void, duration: number = 800) => {
        // Reset values
        scale.value = 0.3;
        opacity.value = 0;
        textOpacity.value = 0;
        containerOpacity.value = 1;
        appOpacity.value = 0;
        appScale.value = 0.95;

        setSplashVisible(true);

        // Sequence
        scale.value = withSpring(1, { damping: 10, stiffness: 100 });
        opacity.value = withTiming(1, { duration: 400 });
        textOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));

        setTimeout(() => {
            containerOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
                if (finished) {
                    runOnJS(setSplashVisible)(false);
                    if (onComplete) runOnJS(onComplete)();
                }
            });

            appOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));
            appScale.value = withDelay(100, withSpring(1));
        }, duration);
    };

    useEffect(() => {
        // Auth check is now handled via onRehydrateStorage in authStore
        // which triggers as soon as the store is ready.
        triggerSplash(undefined, 1500);
    }, []);

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    useEffect(() => {
        if (isSplashVisible || isTransitioning) return;

        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/sign-in');
        } else if (isAuthenticated && inAuthGroup && !segments.includes('welcome')) {
            router.replace('/(tabs)/');
        }
    }, [isAuthenticated, segments, isSplashVisible]);

    const splashIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const splashTextStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));

    const splashContainerStyle = useAnimatedStyle(() => ({
        opacity: containerOpacity.value,
    }));

    const appAnimatedStyle = useAnimatedStyle(() => ({
        opacity: appOpacity.value,
        transform: [{ scale: appScale.value }],
        flex: 1,
    }));

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <StatusBar style="light" />

            <Animated.View style={appAnimatedStyle}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="quiz" options={{ presentation: 'modal' }} />
                </Stack>
            </Animated.View>

            {isSplashVisible && (
                <Animated.View
                    className="absolute inset-0 bg-black items-center justify-center z-50"
                    style={splashContainerStyle}
                >
                    <View className="items-center gap-6">
                        <Animated.View style={splashIconStyle}>
                            <Image
                                source={require('../assets/icon.jpg')}
                                className="w-40 h-40 rounded-[32px] border-4 border-amber-500/20"
                                resizeMode="cover"
                            />
                        </Animated.View>
                        <Animated.View style={splashTextStyle}>
                            <Text className="text-4xl font-bold text-white tracking-[8px] font-sans">
                                STRATEGOS
                            </Text>
                            <Text className="text-xs text-amber-500/80 tracking-widest text-center mt-2 uppercase font-medium">
                                Grandmaster Chess
                            </Text>
                        </Animated.View>
                    </View>
                </Animated.View>
            )}
        </View>
    );
}
