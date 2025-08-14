import { StyleSheet, TouchableOpacity } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getTvEpisodesBySeasonId, getTvShowById } from "@/constants/ApiRoutes";
import { TvShowDetail, TvShowEpisode } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Link, useLocalSearchParams } from "expo-router";
import { map, size, toString } from "lodash";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { GenreBadges } from "@/components/GenreBadges";
import { hasFlag } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { openBrowserAsync } from "expo-web-browser";
import { Badge } from "@/components/Badge";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export default function ShowsDetailScreen() {
  const [selectedSeason, setSelectedSeason] = useState<number>();
  const { id } = useLocalSearchParams();
  const { data } = useCustomSWR<TvShowDetail>(getTvShowById(toString(id)));
  const { data: seasonEpisodesData } = useCustomSWR<TvShowEpisode[]>(
    getTvEpisodesBySeasonId(selectedSeason ?? 0),
    {
      enabled: !!selectedSeason,
    }
  );

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={data?.image.original ?? data?.image.medium}
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
      <ThemedText style={{ color: "#fff", fontWeight: "700", fontSize: 32 }}>
        {data?.name}
      </ThemedText>
      <GenreBadges genres={data?.genres} />
      <ThemedText stripped style={{ color: "#fff" }}>
        {data?.summary}
      </ThemedText>
      {data?._embedded?.cast && (
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
            Cast
          </ThemedText>
          <Animated.FlatList
            horizontal
            data={data?._embedded?.cast}
            keyExtractor={(item) => toString(item.character.id)}
            renderItem={({ item }) => (
              <ThemedView style={{ marginRight: 16, backgroundColor: "#000" }}>
                <Image
                  source={
                    item.person.image.original || item.person.image.medium
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
            )}
          />
        </>
      )}
      {size(data?.schedule.days) > 0 && (
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
            Schedule
          </ThemedText>
          {data?.network.name && (
            <ThemedView style={{ backgroundColor: "#000" }}>
              <ThemedText
                style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}
              >
                Aired by{" "}
              </ThemedText>
              <ThemedView
                style={{
                  marginRight: 16,
                  backgroundColor: "#000",
                  flexDirection: "row",
                }}
              >
                <ThemedText
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    marginTop: 8,
                    marginRight: 8,
                  }}
                >
                  {data?.network.name}
                </ThemedText>
                {hasFlag(toString(data?.network.country.code)) && (
                  <ThemedText style={{ marginTop: 8 }}>
                    {getUnicodeFlagIcon(toString(data?.network.country.code))}
                  </ThemedText>
                )}
              </ThemedView>
              {data?.network.officialSite && (
                <TouchableOpacity
                  onPress={() => openBrowserAsync(data.network.officialSite)}
                >
                  <ThemedText
                    style={{ color: "blue", fontWeight: "700", marginTop: 8 }}
                  >
                    Official Website
                  </ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          )}
          <Animated.FlatList
            horizontal
            data={data?.schedule.days}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <ThemedView style={{ marginRight: 16, backgroundColor: "#000" }}>
                <ThemedText
                  style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}
                >
                  {item}
                </ThemedText>
                <ThemedText
                  style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}
                >
                  <Badge outlined text={toString(data?.schedule.time)} />
                </ThemedText>
              </ThemedView>
            )}
          />
        </>
      )}
      {data?._embedded?.seasons && (
        <Picker
          style={{
            backgroundColor: "#aaa",
            color: "#000",
          }}
          mode="dropdown"
          selectedValue={selectedSeason}
          onValueChange={(itemValue) => setSelectedSeason(itemValue)}
        >
          {map(data?._embedded?.seasons, (season) => (
            <Picker.Item
              key={season.id}
              label={`Season ${season.number}`}
              value={season.id}
            />
          ))}
        </Picker>
      )}
      <Animated.FlatList
        keyExtractor={(item) => toString(item.id)}
        data={seasonEpisodesData}
        renderItem={({ item }) => (
          <Link href={`/home/episodes/${item.id}`} style={{ marginBottom: 24 }}>
            <ThemedView style={{ backgroundColor: "#000" }}>
              <ThemedView
                style={{
                  backgroundColor: "#000",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={styles.episodeImage}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  contentPosition="top center"
                  source={item.image.original ?? item.image.medium}
                />
                <ThemedView
                  style={{ flex: 2, backgroundColor: "#000", marginLeft: 8 }}
                >
                  <ThemedText style={{ color: "#fff", fontSize: 14 }}>
                    {item.number}. {item.name}
                  </ThemedText>
                  <ThemedText
                    style={{ color: "#fff", marginTop: 8, fontSize: 14 }}
                  >
                    Rating: {item.rating.average}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText
                stripped
                style={{ color: "#fff", marginTop: 8, fontSize: 14 }}
              >
                {item.summary}
              </ThemedText>
            </ThemedView>
          </Link>
        )}
      />
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
  episodeImage: {
    flex: 1,
    height: 125,
    width: 195,
    borderRadius: 6,
  },
});
