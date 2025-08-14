import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        title: "",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="shows/[id]" options={{ presentation: "modal" }} />
      <Stack.Screen name="episodes/[id]" options={{ presentation: "modal" }} />
      <Stack.Screen name="people/[id]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
