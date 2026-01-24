import { Tabs } from "expo-router";
import { View } from "react-native";
import { Home, Gamepad2, Users, User, Puzzle, GraduationCap } from "lucide-react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#1c1917", // bg-card
                    borderTopColor: "#292524", // border-border/50
                    height: 80,
                    paddingTop: 10,
                    paddingBottom: 25,
                },
                tabBarActiveTintColor: "#ea580c", // text-primary
                tabBarInactiveTintColor: "#a8a29e", // text-muted-foreground
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "500",
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="game"
                options={{
                    title: "Play",
                    tabBarIcon: ({ color }) => <Gamepad2 size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: "Learn",
                    tabBarIcon: ({ color }) => <GraduationCap size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: "Community",
                    tabBarIcon: ({ color }) => <Users size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="puzzles"
                options={{
                    title: "Puzzles",
                    href: null, // Hidden from tab bar (accessed via internal links mostly)
                }}
            />
        </Tabs>
    );
}
