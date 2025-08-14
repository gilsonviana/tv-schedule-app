import { StyleSheet, SectionList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { getTvShows } from "@/constants/ApiRoutes";
import { isEmpty, shuffle, slice, toString } from "lodash";
import { TvShow } from "@/constants/Types";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { Link } from "expo-router";
import { blurhash } from "@/constants/Misc";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";

export default function HomeScreen() {
  const { favoriteShows, favoriteEpisodes } = useSelector(
    (state: RootState) => state.favorites
  );
  const { data } = useCustomSWR<TvShow[]>(getTvShows());

  const suffledData = shuffle(data);

  const sections = [
    {
      title: "Must-See Picks of the Day",
      data: slice(suffledData, 0, 10),
    },
    {
      title: "Trending & Hidden Gems",
      data: slice(suffledData, 10, 20),
    },
  ];

  if (!isEmpty(favoriteShows)) {
    sections.push({
      title: "Favorite Shows",
      data: favoriteShows as TvShow[],
    });
  }

  if (!isEmpty(favoriteEpisodes)) {
    sections.push({
      title: "Favorite Episodes",
      data: favoriteEpisodes as TvShow[],
    });
  }

  return (
    <SectionList
      style={{ flex: 1, backgroundColor: "#000", paddingTop: 36 }}
      keyExtractor={(item, index) => item.id?.toString?.() ?? index.toString()}
      renderSectionHeader={({ section }) => (
        <>
          <ThemedText
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 21,
              paddingVertical: 16,
            }}
          >
            {section.title}
          </ThemedText>
          <Animated.FlatList
            horizontal
            contentContainerStyle={{ backgroundColor: "#000" }}
            style={{ backgroundColor: "#000" }}
            data={section.data}
            keyExtractor={(item) => toString(item.id)}
            renderItem={({ item }) => (
              <Link href={`/home/shows/${item.id}`}>
                <ThemedView
                  style={{
                    paddingInline: 16,
                    backgroundColor: "#000",
                  }}
                >
                  <Image
                    style={styles.image}
                    source={item.image.medium}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                  />
                </ThemedView>
              </Link>
            )}
          />
        </>
      )}
      renderItem={() => <></>}
      sections={sections}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 195,
    width: 120,
    backgroundColor: "#0553",
    borderRadius: 4,
  },
});
