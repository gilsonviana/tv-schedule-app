import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider as ReduxProvider } from "react-redux";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import store, { getState, PERSIST_KEY } from "@/store";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    const hydrateStore = async () => {
      const persistedState = await getState(PERSIST_KEY);
      if (persistedState) {
        store.dispatch({ type: "HYDRATE", payload: persistedState });
      }
      setRehydrated(true);
    };
    hydrateStore();
  }, []);

  if (!loaded || !rehydrated) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ReduxProvider>
  );
}
