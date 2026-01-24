import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from 'lucide-react-native';
import { useQuizStore } from '../stores/quizStore';
import { cn } from '../lib/utils';

export default function QuizScreen() {
    const router = useRouter();
    const { questions, currentQuestionIndex, score, isComplete, submitAnswer, resetQuiz } = useQuizStore();
    const currentQuestion = questions[currentQuestionIndex];

    const handleExit = () => {
        resetQuiz();
        router.back();
    };

    if (isComplete) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
                <Trophy size={80} color="#f59e0b" />
                <Text className="text-3xl font-bold text-foreground mt-6 text-center">Quiz Complete!</Text>
                <Text className="text-6xl font-black text-primary mt-4">{score}/{questions.length}</Text>
                <Text className="text-muted-foreground mt-2 text-center">
                    {score === questions.length ? "Grandmaster status! Perfect score." : "Keep practicing to improve your skills!"}
                </Text>
                <TouchableOpacity
                    onPress={handleExit}
                    className="bg-primary w-full py-4 rounded-xl items-center mt-12"
                >
                    <Text className="text-primary-foreground font-bold text-lg">Back to Learning</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-row items-center px-4 py-4 gap-4">
                <TouchableOpacity onPress={handleExit}>
                    <ArrowLeft size={24} color="hsl(24 100% 45%)" />
                </TouchableOpacity>
                <View className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                    <View
                        className="bg-primary h-full"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </View>
                <Text className="text-muted-foreground font-bold">{currentQuestionIndex + 1}/{questions.length}</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-8">
                <Text className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                    {currentQuestion.topic} • {currentQuestion.difficulty}
                </Text>
                <Text className="text-2xl font-bold text-foreground mb-8">
                    {currentQuestion.question}
                </Text>

                <View className="gap-4">
                    {currentQuestion.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => submitAnswer(index)}
                            className="bg-card p-5 rounded-2xl border border-border/50 flex-row items-center justify-between"
                        >
                            <Text className="text-foreground text-lg font-medium">{option}</Text>
                            <View className="w-6 h-6 rounded-full border border-border items-center justify-center">
                                <Text className="text-[10px] font-bold text-muted-foreground">{String.fromCharCode(65 + index)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
