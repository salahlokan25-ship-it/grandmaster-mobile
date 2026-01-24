import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { generateStrategoId } from '../lib/utils';
import Animated, {
    FadeInUp,
    FadeOutDown,
    Layout,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withSpring
} from 'react-native-reanimated';
import { Mail, Lock, UserPlus, LogIn, ChevronRight, AlertCircle } from 'lucide-react-native';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Logo pulse animation
    const logoScale = useSharedValue(1);

    useEffect(() => {
        logoScale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
    }));

    const handleAuth = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        const { setHasCompletedOnboarding } = useUserStore.getState();

        try {
            if (isLogin) {
                // For existing users, assume onboarding is done to speed up transition
                setHasCompletedOnboarding(true);
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                // For new users, explicitly flag that onboarding is required
                setHasCompletedOnboarding(false);
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Create user profile in Firestore with unique Stratego ID
                await setDoc(doc(db, 'users', user.uid), {
                    id: user.uid,
                    strategoId: generateStrategoId(),
                    username: email.split('@')[0],
                    avatar: `https://i.pravatar.cc/150?u=${user.uid}`,
                    elo: 1200,
                    createdAt: Date.now(),
                });
            }
            // Transition is handled by _layout.tsx listener
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', ''));
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0c0a09]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-6 justify-center"
            >
                {/* Brand Header */}
                <Animated.View
                    entering={FadeInUp.delay(200).duration(800)}
                    className="items-center mb-12"
                >
                    <Animated.View style={logoStyle} className="mb-6">
                        <View className="p-1 rounded-[40px] border-2 border-amber-500/30">
                            <Image
                                source={require('../assets/icon.jpg')}
                                className="w-24 h-24 rounded-[36px]"
                                resizeMode="cover"
                            />
                        </View>
                    </Animated.View>
                    <Text className="text-4xl font-black text-white tracking-[8px] italic">
                        STRATEGOS
                    </Text>
                    <View className="h-[2px] w-12 bg-amber-500 mt-2 mb-1" />
                    <Text className="text-xs text-amber-500/60 uppercase tracking-[4px] font-bold">
                        Grandmaster Chess
                    </Text>
                </Animated.View>

                {/* Form Container */}
                <Animated.View
                    layout={Layout.springify()}
                    className="bg-stone-900/50 p-8 rounded-[40px] border border-white/5 shadow-2xl"
                >
                    <Text className="text-2xl font-bold text-white mb-8 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </Text>

                    {/* Inputs */}
                    <View className="gap-4">
                        <View className="relative">
                            <View className="absolute left-4 top-4 z-10">
                                <Mail size={18} color="rgba(255,255,255,0.4)" />
                            </View>
                            <TextInput
                                placeholder="Email Address"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                className="bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white font-medium"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View className="relative">
                            <View className="absolute left-4 top-4 z-10">
                                <Lock size={18} color="rgba(255,255,255,0.4)" />
                            </View>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                className="bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white font-medium"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    {error ? (
                        <Animated.View
                            entering={FadeInUp}
                            className="flex-row items-center gap-2 mt-4 bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                        >
                            <AlertCircle size={14} color="#ef4444" />
                            <Text className="text-red-500 text-xs font-medium flex-1">{error}</Text>
                        </Animated.View>
                    ) : null}

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleAuth}
                        disabled={loading}
                        className={`mt-8 py-5 rounded-2xl items-center flex-row justify-center gap-3 overflow-hidden ${loading ? 'opacity-50' : ''}`}
                        style={{ backgroundColor: '#f59e0b', shadowColor: '#f59e0b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 }}
                    >
                        {isLogin ? (
                            <LogIn size={20} color="#0c0a09" strokeWidth={2.5} />
                        ) : (
                            <UserPlus size={20} color="#0c0a09" strokeWidth={2.5} />
                        )}
                        <Text className="text-[#0c0a09] font-black text-lg uppercase tracking-wider">
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Get Started')}
                        </Text>
                        <ChevronRight size={18} color="#0c0a09" strokeWidth={3} />
                    </TouchableOpacity>

                    {/* Toggle Mode */}
                    <TouchableOpacity
                        onPress={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="mt-6 items-center"
                    >
                        <Text className="text-white/40 font-medium">
                            {isLogin ? "New to Strategos? " : "Already have an account? "}
                            <Text className="text-amber-500/80 font-bold">
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Footer Deco */}
                <View className="mt-12 items-center opacity-20">
                    <Text className="text-[10px] text-white tracking-[10px] uppercase font-black">
                        Mastery • Strategy • Honor
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
