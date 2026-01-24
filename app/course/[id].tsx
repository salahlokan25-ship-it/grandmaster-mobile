import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, Clock, Users, Star, Play, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCourseById } from '../../data/courses';
import { cn } from '../../lib/utils';
import { IconButton } from '../../components/ui/IconButton';

export default function CourseDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const course = getCourseById(id as string);

    if (!course) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center">
                <Text className="text-foreground">Course not found</Text>
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
                    <Text className="text-lg font-semibold text-foreground">Course Details</Text>
                    <View className="w-10" />
                </View>

                {/* Course Header */}
                <View className="px-4 py-6 border-b border-border/50">
                    <View className="flex-row items-center gap-2 mb-2">
                        <View className={cn(
                            "px-2 py-1 rounded",
                            course.category === 'openings' && "bg-blue-600/20",
                            course.category === 'tactics' && "bg-red-600/20",
                            course.category === 'strategy' && "bg-green-600/20",
                            course.category === 'endgame' && "bg-purple-600/20",
                            course.category === 'rules' && "bg-amber-600/20"
                        )}>
                            <Text className={cn(
                                "text-xs font-bold uppercase",
                                course.category === 'openings' && "text-blue-400",
                                course.category === 'tactics' && "text-red-400",
                                course.category === 'strategy' && "text-green-400",
                                course.category === 'endgame' && "text-purple-400",
                                course.category === 'rules' && "text-amber-400"
                            )}>
                                {course.category}
                            </Text>
                        </View>
                        <View className={cn(
                            "px-2 py-1 rounded bg-secondary"
                        )}>
                            <Text className="text-xs font-medium text-muted-foreground uppercase">
                                {course.level}
                            </Text>
                        </View>
                    </View>

                    <Text className="text-2xl font-bold text-foreground mb-2">{course.title}</Text>
                    <Text className="text-muted-foreground mb-4">{course.fullDescription}</Text>

                    {/* Meta Info */}
                    <View className="flex-row flex-wrap gap-4">
                        <View className="flex-row items-center gap-2">
                            <Clock size={16} color="hsl(30 10% 55%)" />
                            <Text className="text-sm text-muted-foreground">{course.duration} min</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <BookOpen size={16} color="hsl(30 10% 55%)" />
                            <Text className="text-sm text-muted-foreground">{course.lessons.length} lessons</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Users size={16} color="hsl(30 10% 55%)" />
                            <Text className="text-sm text-muted-foreground">{course.studentsEnrolled.toLocaleString()} students</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Star size={16} color="#fbbf24" fill="#fbbf24" />
                            <Text className="text-sm text-muted-foreground">{course.rating}/5.0</Text>
                        </View>
                    </View>

                    {/* Instructor */}
                    <View className="mt-4 pt-4 border-t border-border/50">
                        <Text className="text-xs font-semibold text-muted-foreground uppercase mb-1">Instructor</Text>
                        <Text className="text-foreground font-medium">{course.author}</Text>
                    </View>
                </View>

                {/* Lessons List */}
                <View className="px-4 py-4">
                    <Text className="text-lg font-bold text-foreground mb-3">Course Content</Text>
                    <View className="gap-2">
                        {course.lessons.map((lesson, index) => (
                            <Pressable
                                key={lesson.id}
                                onPress={() => router.push(`/lesson/${lesson.id}`)}
                                className="bg-card rounded-xl p-4 border border-border/50 active:bg-secondary"
                            >
                                <View className="flex-row items-start gap-3">
                                    <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
                                        <Text className="text-primary font-bold text-sm">{index + 1}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-foreground mb-1">{lesson.title}</Text>
                                        <View className="flex-row items-center gap-3">
                                            <View className={cn(
                                                "px-2 py-0.5 rounded",
                                                lesson.type === 'theory' && "bg-blue-600/20",
                                                lesson.type === 'practice' && "bg-green-600/20",
                                                lesson.type === 'quiz' && "bg-purple-600/20"
                                            )}>
                                                <Text className={cn(
                                                    "text-xs font-medium uppercase",
                                                    lesson.type === 'theory' && "text-blue-400",
                                                    lesson.type === 'practice' && "text-green-400",
                                                    lesson.type === 'quiz' && "text-purple-400"
                                                )}>
                                                    {lesson.type}
                                                </Text>
                                            </View>
                                            <Text className="text-xs text-muted-foreground">{lesson.estimatedTime} min</Text>
                                        </View>
                                    </View>
                                    <Play size={20} color="hsl(24 100% 45%)" />
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Start Course Button */}
                <View className="px-4 pb-6">
                    <Pressable
                        onPress={() => {
                            if (course.lessons.length > 0) {
                                router.push(`/lesson/${course.lessons[0].id}`);
                            }
                        }}
                        className="w-full py-4 bg-primary rounded-xl items-center active:bg-primary/90"
                    >
                        <Text className="text-primary-foreground font-bold text-lg">Start Course</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
