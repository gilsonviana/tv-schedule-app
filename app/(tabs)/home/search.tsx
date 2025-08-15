import { searchShowQuery } from "@/constants/ApiRoutes";
import { TvSearchResult } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";
import { blurhash } from "@/constants/Misc";
import { ThemedText } from "@/components/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useCustomSWR<TvSearchResult[]>(
    searchShowQuery("breaking")
  );
  console.log({ data: JSON.stringify(data?.[0]) });
  return (
    <Animated.FlatList
      style={{ backgroundColor: "#000" }}
      contentContainerStyle={{ paddingInline: 16 }}
      data={!isLoading ? data : undefined}
      ListEmptyComponent={() => <Text>Empty...</Text>}
      ListHeaderComponent={() => (
        <View style={{ backgroundColor: "#ddd", marginTop: insets.top + 34 }}>
          <TextInput placeholder="Type something..." />
        </View>
      )}
      renderItem={({ item }) => (
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.episodeImage}
            placeholder={{ blurhash }}
            contentFit="cover"
            contentPosition="top center"
            source={item.show.image?.original ?? item.show.image?.medium}
          />
          <ThemedText
            stripped
            style={{ color: "#fff", marginTop: 8, fontSize: 14 }}
          >
            {item.show.name}
          </ThemedText>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: "auto",
    width: "100%",
  },
  castImage: {
    flex: 1,
    height: 250,
    width: 250,
    aspectRatio: 9 / 16,
    borderRadius: 4,
  },
  episodeImage: {
    flex: 1,
    height: 125,
    width: 195,
    borderRadius: 6,
  },
});
