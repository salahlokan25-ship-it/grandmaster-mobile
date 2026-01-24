import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, BookOpen, Star, Clock, Users } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { courses, getCoursesByCategory } from '../../data/courses';
import type { CourseCategory } from '../../types/learning';

// Import assets
const chessHero = require('../../assets/chess-hero.jpg');
const chessEndgame = require('../../assets/chess-endgame.jpg');
const chessKnight = require('../../assets/chess-knight.jpg');

const categories = ['All', 'Openings', 'Tactics', 'Strategy', 'Endgame', 'Rules'];

export default function LearningPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = activeCategory === 'All'
        ? courses
        : getCoursesByCategory(activeCategory.toLowerCase() as CourseCategory);

    const searchedCourses = searchQuery
        ? filteredCourses.filter(course =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : filteredCourses;

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-border/50">
                    <Text className="text-lg font-semibold text-foreground">Learning Center</Text>
                    <View className="w-10 h-10 rounded-lg bg-primary/20 items-center justify-center">
                        <BookOpen size={20} color="hsl(24 100% 45%)" />
                    </View>
                </View>

                <View className="px-4 py-4 gap-5">
                    {/* Greeting */}
                    <View>
                        <Text className="text-2xl font-bold text-foreground">Master Your Game</Text>
                        <Text className="text-muted-foreground">Explore {courses.length} comprehensive courses</Text>
                    </View>

                    {/* Search */}
                    <View className="relative justify-center">
                        <Search size={20} className="absolute left-4 z-10 text-muted-foreground" color="hsl(30 10% 55%)" />
                        <TextInput
                            placeholder="Search courses..."
                            placeholderTextColor="hsl(30 10% 55%)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-secondary border border-border text-foreground"
                        />
                    </View>

                    {/* Categories */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 pb-2 -mx-4 px-4 overflow-visible">
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                className={cn(
                                    'px-4 py-2 rounded-full mr-2',
                                    activeCategory === cat
                                        ? 'bg-primary'
                                        : 'bg-secondary'
                                )}
                            >
                                <Text className={cn(
                                    'text-sm font-medium',
                                    activeCategory === cat ? 'text-primary-foreground' : 'text-muted-foreground'
                                )}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Course Grid */}
                    <View>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-bold text-foreground">
                                {activeCategory === 'All' ? 'All Courses' : `${activeCategory} Courses`}
                            </Text>
                            <Text className="text-sm text-muted-foreground">{searchedCourses.length} courses</Text>
                        </View>

                        <View className="gap-4">
                            {searchedCourses.map((course) => (
                                <Pressable
                                    key={course.id}
                                    onPress={() => router.push(`/course/${course.id}`)}
                                    className="bg-card rounded-2xl overflow-hidden border border-border/50 active:bg-secondary/50"
                                >
                                    <View className="h-32 relative bg-stone-800">
                                        <Image
                                            source={
                                                course.category === 'openings' ? chessHero :
                                                    course.category === 'endgame' ? chessEndgame :
                                                        chessKnight
                                            }
                                            className="w-full h-full opacity-40"
                                            resizeMode="cover"
                                        />
                                        <View className="absolute inset-0 items-center justify-center">
                                            <Text className="text-xl font-bold text-white tracking-wider uppercase">
                                                {course.category}
                                            </Text>
                                        </View>
                                        <View className={cn(
                                            "absolute top-3 left-3 px-2 py-1 rounded",
                                            course.level === 'beginner' && "bg-green-600",
                                            course.level === 'intermediate' && "bg-amber-600",
                                            course.level === 'advanced' && "bg-red-600",
                                            course.level === 'master' && "bg-purple-600"
                                        )}>
                                            <Text className="text-white text-xs font-bold uppercase">{course.level}</Text>
                                        </View>
                                    </View>
                                    <View className="p-4">
                                        <Text className="font-bold text-lg text-foreground mb-1">{course.title}</Text>
                                        <Text className="text-sm text-muted-foreground mb-3" numberOfLines={2}>
                                            {course.shortDescription}
                                        </Text>

                                        <View className="flex-row items-center gap-4 mb-3">
                                            <View className="flex-row items-center gap-1">
                                                <Clock size={14} color="hsl(30 10% 55%)" />
                                                <Text className="text-xs text-muted-foreground">{course.duration}min</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                                <BookOpen size={14} color="hsl(30 10% 55%)" />
                                                <Text className="text-xs text-muted-foreground">{course.lessons.length} lessons</Text>
                                            </View>
                                            <View className="flex-row items-center gap-1">
                                                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                                                <Text className="text-xs text-muted-foreground">{course.rating}</Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-xs text-muted-foreground">by {course.author}</Text>
                                            <View className="px-3 py-1.5 bg-primary rounded-lg">
                                                <Text className="text-primary-foreground text-xs font-semibold">Start Course</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {searchedCourses.length === 0 && (
                        <View className="items-center py-12">
                            <Text className="text-muted-foreground text-center">
                                No courses found for "{searchQuery}"
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
