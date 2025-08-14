import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabPreferencesScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <ThemedView>
        <ThemedText type="title">Preferences</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
