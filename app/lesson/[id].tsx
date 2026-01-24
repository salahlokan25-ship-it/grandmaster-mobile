import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { courses } from '../../data/courses';
import { cn } from '../../lib/utils';
import { IconButton } from '../../components/ui/IconButton';
import type { Lesson } from '../../types/learning';

function getLessonById(lessonId: string): { lesson: Lesson | undefined, courseTitle: string, lessonIndex: number, totalLessons: number } {
    for (const course of courses) {
        const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex !== -1) {
            return {
                lesson: course.lessons[lessonIndex],
                courseTitle: course.title,
                lessonIndex,
                totalLessons: course.lessons.length
            };
        }
    }
    return { lesson: undefined, courseTitle: '', lessonIndex: -1, totalLessons: 0 };
}

function getNextLesson(currentLessonId: string): string | null {
    for (const course of courses) {
        const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId);
        if (currentIndex !== -1 && currentIndex < course.lessons.length - 1) {
            return course.lessons[currentIndex + 1].id;
        }
    }
    return null;
}

function getPreviousLesson(currentLessonId: string): string | null {
    for (const course of courses) {
        const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId);
        if (currentIndex > 0) {
            return course.lessons[currentIndex - 1].id;
        }
    }
    return null;
}

export default function LessonPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { lesson, courseTitle, lessonIndex, totalLessons } = getLessonById(id as string);

    const nextLessonId = getNextLesson(id as string);
    const prevLessonId = getPreviousLesson(id as string);

    if (!lesson) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <Text className="text-foreground">Lesson not found</Text>
                <Pressable onPress={() => router.back()} className="mt-4 px-6 py-3 bg-primary rounded-xl">
                    <Text className="text-primary-foreground font-semibold">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-border/50">
                    <IconButton icon={ArrowLeft} onPress={() => router.back()} />
                    <View className="flex-1 items-center mx-3">
                        <Text className="text-xs text-muted-foreground uppercase font-semibold">
                            Lesson {lessonIndex + 1} of {totalLessons}
                        </Text>
                        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>{courseTitle}</Text>
                    </View>
                    <View className="w-10" />
                </View>

                {/* Lesson Header */}
                <View className="px-4 py-6 border-b border-border/50">
                    <View className="flex-row items-center gap-2 mb-3">
                        <View className={cn(
                            "px-2 py-1 rounded",
                            lesson.type === 'theory' && "bg-blue-600/20",
                            lesson.type === 'practice' && "bg-green-600/20",
                            lesson.type === 'quiz' && "bg-purple-600/20",
                            lesson.type === 'video' && "bg-red-600/20"
                        )}>
                            <Text className={cn(
                                "text-xs font-bold uppercase",
                                lesson.type === 'theory' && "text-blue-400",
                                lesson.type === 'practice' && "text-green-400",
                                lesson.type === 'quiz' && "text-purple-400",
                                lesson.type === 'video' && "text-red-400"
                            )}>
                                {lesson.type}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <Clock size={14} color="hsl(30 10% 55%)" />
                            <Text className="text-xs text-muted-foreground">{lesson.estimatedTime} min</Text>
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-foreground">{lesson.title}</Text>
                </View>

                {/* Lesson Content */}
                <View className="px-4 py-6">
                    {lesson.content.text && (
                        <View className="mb-6">
                            <Text className="text-foreground leading-7 text-base">
                                {lesson.content.text}
                            </Text>
                        </View>
                    )}

                    {/* Chess Positions */}
                    {lesson.content.positions && lesson.content.positions.length > 0 && (
                        <View className="gap-6">
                            {lesson.content.positions.map((position, index) => (
                                <View key={index} className="bg-card rounded-2xl p-4 border border-border/50">
                                    {position.caption && (
                                        <Text className="font-bold text-foreground mb-2">{position.caption}</Text>
                                    )}
                                    <View className="bg-secondary/50 rounded-xl p-4 mb-2">
                                        <Text className="text-xs text-muted-foreground font-mono mb-1">FEN:</Text>
                                        <Text className="text-xs text-foreground font-mono">{position.fen}</Text>
                                    </View>
                                    {position.explanation && (
                                        <Text className="text-sm text-muted-foreground mt-2">{position.explanation}</Text>
                                    )}
                                    {position.moveSequence && (
                                        <View className="mt-3 pt-3 border-t border-border/50">
                                            <Text className="text-xs font-semibold text-muted-foreground uppercase mb-1">Moves:</Text>
                                            <Text className="text-sm text-foreground font-mono">{position.moveSequence}</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Video URL placeholder */}
                    {lesson.content.videoUrl && (
                        <View className="bg-card rounded-2xl p-6 border border-border/50 items-center">
                            <BookOpen size={40} color="hsl(24 100% 45%)" />
                            <Text className="text-foreground font-semibold mt-2 mb-1">Video Lesson</Text>
                            <Text className="text-xs text-muted-foreground text-center">
                                Video player integration coming soon
                            </Text>
                        </View>
                    )}
                </View>

                {/* Navigation Buttons */}
                <View className="px-4 pb-6 gap-3">
                    <View className="flex-row gap-3">
                        {prevLessonId ? (
                            <Pressable
                                onPress={() => router.push(`/lesson/${prevLessonId}`)}
                                className="flex-1 py-3 border border-border rounded-xl flex-row items-center justify-center gap-2 active:bg-secondary"
                            >
                                <ChevronLeft size={20} color="hsl(30 10% 55%)" />
                                <Text className="text-foreground font-medium">Previous</Text>
                            </Pressable>
                        ) : (
                            <View className="flex-1" />
                        )}

                        {nextLessonId && (
                            <Pressable
                                onPress={() => router.push(`/lesson/${nextLessonId}`)}
                                className="flex-1 py-3 bg-primary rounded-xl flex-row items-center justify-center gap-2 active:bg-primary/90"
                            >
                                <Text className="text-primary-foreground font-semibold">Next Lesson</Text>
                                <ChevronRight size={20} color="white" />
                            </Pressable>
                        )}
                    </View>

                    {!nextLessonId && (
                        <Pressable
                            onPress={() => router.back()}
                            className="w-full py-3 bg-green-600 rounded-xl flex-row items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={20} color="white" />
                            <Text className="text-white font-semibold">Complete Course</Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
