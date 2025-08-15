import { searchShowQuery } from "@/constants/ApiRoutes";
import { TvSearchResult } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { View, Text, StyleSheet, TextInput, SafeAreaView } from "react-native";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";
import { blurhash } from "@/constants/Misc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GenreBadges } from "@/components/GenreBadges";
import Feather from "@expo/vector-icons/Feather";
import { CollapsibleText } from "@/components/CollapsibleText";
import { Link } from "expo-router";
import { useDispatch } from "react-redux";
import { addRecently } from "@/store/reducers/recently";
import { useState } from "react";
import Skeleton from "@/components/Skeleton";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useCustomSWR<TvSearchResult[]>(
    searchShowQuery(searchQuery),
    {
      wait: 1000,
    }
  );
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.FlatList
        style={{ backgroundColor: "#000" }}
        contentContainerStyle={{ paddingInline: 16 }}
        data={!isLoading ? data : undefined}
        ListEmptyComponent={() =>
          !searchQuery ? (
            <View
              style={{
                marginTop: 24,
                backgroundColor: "#222",
                padding: 24,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#ddd", fontSize: 18 }}>
                Start typing to search your next favorite TV shows.
              </Text>
            </View>
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <View
                key={`skeleton-${i}`}
                style={{ flexDirection: "row", marginBottom: 16 }}
              >
                <Skeleton width={90} height={150} />
                <View style={{ marginLeft: 16 }}>
                  <Skeleton
                    width={90}
                    height={24}
                    style={{ marginVertical: 8 }}
                  />
                  <Skeleton width={120} height={24} />
                  <Skeleton width={150} height={64} style={{ marginTop: 8 }} />
                </View>
              </View>
            ))
          )
        }
        ListHeaderComponent={() => (
          <View
            style={{
              backgroundColor: "#555",
              marginTop: insets.top + 34,
              marginBottom: 16,
              borderRadius: 6,
              paddingInline: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="search" size={28} color="#ddd" />
            <TextInput
              placeholderTextColor="#ddd"
              style={{ color: "#fff", fontSize: 16 }}
              placeholder="Type something..."
              clearButtonMode="while-editing"
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              returnKeyType="search"
              autoFocus
            />
          </View>
        )}
        renderItem={({ item }) => (
          <Link
            style={{ marginBottom: 16 }}
            href={`/home/shows/${item.show.id}`}
            onPress={() =>
              dispatch(
                addRecently({
                  type: "shows",
                  id: item.show.id,
                  image: item.show.image,
                  name: item.show.name,
                })
              )
            }
          >
            <View
              style={{
                flexDirection: "row",
                gap: 16,
              }}
            >
              <Image
                style={styles.episodeImage}
                placeholder={{ blurhash }}
                contentFit="cover"
                contentPosition="top center"
                source={item.show.image?.original ?? item.show.image?.medium}
              />
              <View style={{ flex: 3 }}>
                <Text
                  style={{
                    color: "#fff",
                    marginVertical: 8,
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  {item.show.name}
                </Text>
                <GenreBadges genres={item?.show.genres} />
                {item.show.summary && (
                  <CollapsibleText
                    containerStyle={{
                      marginTop: 8,
                      backgroundColor: "#000",
                    }}
                    textStyle={{
                      color: "#fff",
                      fontSize: 14,
                    }}
                    text={item.show.summary}
                  />
                )}
              </View>
            </View>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: "auto",
    width: "100%",
  },
  episodeImage: {
    flex: 1,
    height: 195,
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 6,
  },
});
