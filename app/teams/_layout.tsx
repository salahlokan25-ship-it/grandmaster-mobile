import { Stack } from 'expo-router'

export default function TeamsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="invite" options={{ headerShown: false }} />
      <Stack.Screen name="invitations" options={{ headerShown: false }} />
      <Stack.Screen name="[teamId]" options={{ headerShown: false }} />
    </Stack>
  )
}
