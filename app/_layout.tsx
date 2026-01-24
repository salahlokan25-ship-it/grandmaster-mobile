import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Image, Text } from "react-native";
import { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay, runOnJS } from 'react-native-reanimated';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useUserStore } from '../stores/userStore';
import { ChallengeListener } from '../components/ChallengeListener';

export default function RootLayout() {
    const [isSplashVisible, setSplashVisible] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [user, setUser] = useState<any>(null);
    const segments = useSegments();
    const router = useRouter();

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
        const unsubscribe = onAuthStateChanged(auth, u => {
            if (u) {
                // Fetch profile in background to avoid blocking transition
                getDoc(doc(db, 'users', u.uid)).then(async (userDoc) => {
                    let strategoId = '';
                    let userData: any = {};

                    if (userDoc.exists()) {
                        userData = userDoc.data();
                        strategoId = userData.strategoId;

                        // Auto-recovery for missing IDs or old 8-digit IDs
                        if (!strategoId || strategoId.length < 10) {
                            const { generateStrategoId } = await import('../lib/utils');
                            strategoId = generateStrategoId();
                            updateDoc(doc(db, 'users', u.uid), { strategoId })
                                .catch(e => console.error('Failed to auto-repair UID:', e));
                        }
                    } else {
                        // Document doesn't exist yet (race condition during signup)
                        const { generateStrategoId } = await import('../lib/utils');
                        strategoId = generateStrategoId();
                        userData = {
                            id: u.uid,
                            username: u.email?.split('@')[0] || 'Player',
                            strategoId,
                            avatar: `https://i.pravatar.cc/150?u=${u.uid}`,
                            elo: 1200,
                            createdAt: Date.now(),
                        };
                        setDoc(doc(db, 'users', u.uid), userData)
                            .catch(e => console.error('Failed to initialize missing user doc:', e));
                    }

                    useUserStore.getState().setUser({
                        id: u.uid,
                        username: userData.username || u.email?.split('@')[0] || 'Player',
                        avatar: userData.avatar || '',
                        rating: userData.elo || 1200,
                        strategoId: strategoId,
                    });

                    if (userData.hasCompletedOnboarding) {
                        useUserStore.getState().completeOnboarding();
                    }

                    useUserStore.getState().setProfileLoaded(true);
                })
                    .catch(error => {
                        console.warn('Failed to fetch user profile from Firestore:', error);
                        // Minimal fallback - preserved existing strategoId if possible
                        const currentStoreUser = useUserStore.getState().currentUser;
                        useUserStore.getState().setUser({
                            id: u.uid,
                            username: u.email?.split('@')[0] || 'Player',
                            avatar: currentStoreUser.avatar || '',
                            rating: currentStoreUser.rating || 1200,
                            strategoId: currentStoreUser.strategoId || '',
                        });
                        useUserStore.getState().setProfileLoaded(true);
                    });

                // Set basic user data immediately so transition can start
                // ONLY update if store is empty or for a different user
                const currentStoreUser = useUserStore.getState().currentUser;
                if (currentStoreUser.id !== u.uid) {
                    useUserStore.getState().setUser({
                        id: u.uid,
                        username: u.email?.split('@')[0] || 'Player',
                        avatar: currentStoreUser.avatar || '',
                        rating: 1200,
                        strategoId: currentStoreUser.strategoId || '', // Persist existing if available
                    });
                }
            }
            // If user just logged in (from null to u) and we are not in the initial splash
            if (!user && u && !isSplashVisible) {
                // Super-fast transition for login, the 'hold' logic handle the rest
                triggerSplash(() => setIsTransitioning(false), 100);
            }
            setUser(u);
        });

        // Initial boot splash can be slightly longer for brand but still faster than before
        triggerSplash(undefined, 1200);

        return unsubscribe;
    }, []);

    const hasCompletedOnboarding = useUserStore(state => state.hasCompletedOnboarding);
    const isProfileLoaded = useUserStore(state => state.isProfileLoaded);

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    useEffect(() => {
        if (isSplashVisible || isTransitioning) return;

        if (!user && !inAuthGroup) {
            router.replace('/auth');
        } else if (user && inAuthGroup) {
            // Instant transition: if we don't know yet, login assumes true anyway
            if (!hasCompletedOnboarding) {
                router.replace('/onboarding');
            } else {
                router.replace('/(tabs)');
            }
        } else if (user && !hasCompletedOnboarding && !inOnboarding) {
            // Only redirect to onboarding if we are CERTAIN it's needed
            // This avoids flickering for existing users while profile is loading
            router.replace('/onboarding');
        }
    }, [user, segments, isSplashVisible, hasCompletedOnboarding, isProfileLoaded]);

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

    // Critical: Keep splash visible until profile is ready to avoid seeing the login screen hang
    const showSplashOverlay = isSplashVisible || (user && !isProfileLoaded && inAuthGroup);

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <StatusBar style="light" />

            {/* Main App Content - Mounts in background, visibility controlled by showSplashOverlay */}
            <Animated.View style={[appAnimatedStyle, { opacity: (user && !isProfileLoaded && inAuthGroup) ? 0 : appOpacity.value }]}>
                <ChallengeListener />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="auth" options={{ headerShown: false }} />
                    <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="quiz" options={{ presentation: 'modal' }} />
                </Stack>
            </Animated.View>

            {/* Splash Overlay */}
            {showSplashOverlay && (
                <Animated.View
                    className="absolute inset-0 bg-black items-center justify-center z-50"
                    style={[
                        splashContainerStyle,
                        // Force opacity 1 if we are explicitly holding for profile
                        (user && !isProfileLoaded && inAuthGroup) ? { opacity: 1 } : {}
                    ]}
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
