import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { ParallaxFlatList } from "@/components/ui/ParallaxFlatList";
import { StrippedText } from "@/components/ui/StrippedText";
import { getTvEpisodesBySeasonId, getTvShowById } from "@/constants/ApiRoutes";
import { TvShowDetail, TvShowEpisode } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useLocalSearchParams } from "expo-router";
import { map, size, toString } from "lodash";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { GenreBadges } from "@/components/ui/GenreBadges";
import { hasFlag } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { openBrowserAsync } from "expo-web-browser";
import { Badge } from "@/components/ui/Badge";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { blurhash } from "@/constants/Misc";
import { useDispatch } from "react-redux";
import { addRecently } from "@/store/reducers/recently";
import { ListItem } from "@/components/ui/ListItem";
import { TitleRow } from "@/components/ui/TitleRow";
import { EpisodeListItem } from "@/components/ui/EpisodeListItem";

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
    <ParallaxFlatList
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
      <TitleRow
        favoriteType="shows"
        name={data?.name}
        id={id as string}
        image={data?.image}
      />
      <GenreBadges genres={data?.genres} />
      <StrippedText style={{ color: "#fff" }}>{data?.summary}</StrippedText>
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
              <ListItem
                item={item}
                variant="guest"
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
              />
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
        renderItem={({ item }) => <EpisodeListItem {...item} />}
      />
    </ParallaxFlatList>
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
});
