import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { getTvEpisodesBySeasonId, getTvShowById } from "@/constants/ApiRoutes";
import { TvShowDetail, TvShowEpisode } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Link, useLocalSearchParams } from "expo-router";
import { map, size, toNumber, toString } from "lodash";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { GenreBadges } from "@/components/GenreBadges";
import { hasFlag } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { openBrowserAsync } from "expo-web-browser";
import { Badge } from "@/components/Badge";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { blurhash } from "@/constants/Misc";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useDispatch } from "react-redux";
import { addRecently } from "@/store/reducers/recently";

export default function ShowsDetailScreen() {
  const dispatch = useDispatch();
  const [selectedSeason, setSelectedSeason] = useState<number>();
  const { id } = useLocalSearchParams();
  const { data } = useCustomSWR<TvShowDetail>(getTvShowById(toString(id)));
  const { data: seasonEpisodesData } = useCustomSWR<TvShowEpisode[]>(
    getTvEpisodesBySeasonId(selectedSeason ?? 0),
    {
      enabled: !!selectedSeason,
    }
  );

  useEffect(() => {
    const setInitialSeason = () => {
      setSelectedSeason(data?._embedded?.seasons[0].id);
    };

    if (!selectedSeason) {
      setInitialSeason();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 32 }}>
          {data?.name}
        </Text>
        {data?.image && (
          <FavoriteButton
            type="shows"
            id={toNumber(id)}
            image={data.image}
            name={data.name}
          />
        )}
      </View>
      <GenreBadges genres={data?.genres} />
      <ThemedText stripped style={{ color: "#fff" }}>
        {data?.summary}
      </ThemedText>
      {size(data?._embedded?.cast) > 0 && (
        <>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 21,
              marginTop: 24,
              marginBottom: 8,
              color: "#fff",
            }}
          >
            Cast
          </Text>
          <Animated.FlatList
            horizontal
            data={data?._embedded?.cast}
            keyExtractor={(item) => toString(item.character.id)}
            renderItem={({ item }) => (
              <Link
                style={{ marginRight: 16 }}
                href={`/home/people/${item.person.id}`}
                onPress={() =>
                  dispatch(
                    addRecently({
                      type: "people",
                      id: item.person.id,
                      image: item.person.image,
                      name: item.person.name,
                    })
                  )
                }
              >
                <View>
                  <Image
                    source={
                      item.person.image?.original || item.person.image?.medium
                    }
                    style={styles.castImage}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    contentPosition="top center"
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      marginTop: 8,
                      fontSize: 16,
                    }}
                  >
                    {item.person.name}
                  </Text>
                  <Text style={{ color: "#ddd", fontSize: 16 }}>
                    {item.character.name}
                  </Text>
                </View>
              </Link>
            )}
          />
        </>
      )}
      {size(data?.schedule.days) > 0 && (
        <>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 21,
              marginTop: 24,
              marginBottom: 8,
              color: "#fff",
            }}
          >
            Schedule
          </Text>
          {data?.network?.name && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    marginTop: 8,
                    fontSize: 16,
                  }}
                >
                  Aired by{" "}
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                    }}
                  >
                    {data?.network.name}{" "}
                    {hasFlag(toString(data?.network.country.code)) &&
                      getUnicodeFlagIcon(data?.network.country.code)}
                  </Text>
                </Text>
              </View>
              {data?.network.officialSite && (
                <TouchableOpacity
                  onPress={() => openBrowserAsync(data.network.officialSite)}
                >
                  <Text
                    style={{
                      color: "blue",
                      fontWeight: "700",
                      marginTop: 8,
                      fontSize: 16,
                    }}
                  >
                    Official Website
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
          <Animated.FlatList
            horizontal
            data={data?.schedule.days}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={{ marginRight: 16, alignItems: "flex-start" }}>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    marginVertical: 8,
                    fontSize: 16,
                  }}
                >
                  {item}
                </Text>
                <Badge outlined text={toString(data?.schedule.time)} />
              </View>
            )}
          />
        </>
      )}
      {data?._embedded?.seasons && (
        <Picker
          style={{
            backgroundColor: "#aaa",
            color: "#000",
            marginTop: 24,
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
          <Link
            href={`/home/episodes/${item.id}`}
            style={{ marginBottom: 24 }}
            onPress={() =>
              dispatch(
                addRecently({
                  type: "episodes",
                  id: item.id,
                  image: item.image,
                  name: item.name,
                })
              )
            }
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  style={styles.episodeImage}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  contentPosition="top center"
                  source={item.image?.original ?? item.image?.medium}
                />
                <View style={{ flex: 2, marginLeft: 8 }}>
                  <ThemedText style={{ color: "#fff", fontSize: 14 }}>
                    {item.number}. {item.name}
                  </ThemedText>
                  <ThemedText
                    style={{ color: "#fff", marginTop: 8, fontSize: 14 }}
                  >
                    Rating: {item.rating.average}
                  </ThemedText>
                </View>
              </View>
              <ThemedText
                stripped
                style={{ color: "#fff", marginTop: 8, fontSize: 14 }}
              >
                {item.summary}
              </ThemedText>
            </View>
          </Link>
        )}
      />
    </ParallaxScrollView>
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
