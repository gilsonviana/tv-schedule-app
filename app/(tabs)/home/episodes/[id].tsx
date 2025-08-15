import { StyleSheet, View, Text } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { getTvEpisodeById } from "@/constants/ApiRoutes";
import { TvEpisodeDetail } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { filter, isEmpty, toNumber, toString } from "lodash";
import { ThemedText } from "@/components/ThemedText";
import { Badge } from "@/components/Badge";
import { ThemedView } from "@/components/ThemedView";
import Animated from "react-native-reanimated";
import { blurhash } from "@/constants/Misc";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";

export default function ShowsEpisodeDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data } = useCustomSWR<TvEpisodeDetail>(
    getTvEpisodeById(toString(id))
  );
  const recentlyEpisodes = useSelector((state: RootState) =>
    filter(state.recently.episodes, (episode) => episode.id !== toNumber(id))
  );

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={data?.image?.original ?? data?.image?.medium}
          style={styles.image}
          placeholder={{ blurhash }}
          contentFit="cover"
          contentPosition="top center"
        />
      }
      headerBackgroundColor={{
        dark: "#000",
        light: "#000",
      }}
      style={{ backgroundColor: "#000" }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: 32,
            lineHeight: 32,
          }}
        >
          {data?.number}. {""}
          {data?.name}
        </Text>
        {data?.image && (
          <FavoriteButton
            type="episodes"
            id={toNumber(id)}
            image={data.image}
            name={data.name}
          />
        )}
      </View>
      <ThemedView style={{ backgroundColor: "#000", flexDirection: "row" }}>
        <Badge text={`Season ${data?.season}`} />
      </ThemedView>
      {data?.airdate && (
        <Text style={{ color: "#ddd", fontSize: 14 }}>
          Aired on {""}
          {new Date(data.airdate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      )}
      <ThemedText stripped style={{ color: "#fff" }}>
        {data?.summary}
      </ThemedText>
      {!isEmpty(data?._embedded?.guestcast) && (
        <>
          <ThemedText
            style={{
              fontWeight: "700",
              fontSize: 21,
              marginTop: 24,
              marginBottom: 8,
              color: "#fff",
            }}
          >
            Guest Cast
          </ThemedText>
          <Animated.FlatList
            horizontal
            data={data?._embedded?.guestcast}
            keyExtractor={(item) => toString(item.character.id)}
            renderItem={({ item }) => (
              <Link
                href={`/home/people/${item.person.id}`}
                style={{ marginRight: 16 }}
              >
                <ThemedView style={{ backgroundColor: "#000" }}>
                  <Image
                    source={
                      item.person.image?.original || item.person.image?.medium
                    }
                    style={styles.image}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    contentPosition="top center"
                  />
                  <ThemedText
                    style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}
                  >
                    {item.person.name}
                  </ThemedText>
                  <ThemedText style={{ color: "#ddd" }}>
                    {item.character.name}
                  </ThemedText>
                </ThemedView>
              </Link>
            )}
          />
        </>
      )}
      {!isEmpty(recentlyEpisodes) && (
        <>
          <ThemedText
            style={{
              fontWeight: "700",
              fontSize: 21,
              marginTop: 24,
              marginBottom: 8,
              color: "#fff",
            }}
          >
            Recently Viewed
          </ThemedText>
          <Animated.FlatList
            horizontal
            data={recentlyEpisodes}
            keyExtractor={(item) => toString(item.id)}
            renderItem={({ item }) => (
              <Link
                href={`/home/episodes/${item.id}`}
                style={{ marginRight: 16 }}
              >
                <View>
                  <Image
                    source={item.image?.original || item.image?.medium}
                    style={styles.image}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    contentPosition="top center"
                  />
                </View>
              </Link>
            )}
          />
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 295,
    minWidth: 200,
    width: "100%",
  },
});
