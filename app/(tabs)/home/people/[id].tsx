import { StyleSheet, View, Text } from "react-native";
import { ParallaxFlatList } from "@/components/ui/ParallaxFlatList";
import { getTvPeopleById } from "@/constants/ApiRoutes";
import {
  TvEpisodeDetail,
  TvShowDetail,
  TvShowPeopleDetail,
} from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { isEmpty, last, map, size, slice, split, toString } from "lodash";
import Animated from "react-native-reanimated";
import { useBatchFetch } from "@/hooks/useBatchFetch";
import { useDispatch } from "react-redux";
import { addRecently } from "@/store/reducers/recently";
import { ListItem, ListItemSkeleton } from "@/components/ui/ListItem";
import { TitleRow } from "@/components/ui/TitleRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RecentlyViewed } from "@/components/ui/RecentlyViewed";
import { blurhash } from "@/constants/Colors";

export default function PeopleDetailScreen() {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const { data } = useCustomSWR<TvShowPeopleDetail>(
    getTvPeopleById(toString(id))
  );

  const guestCastLinks = map(
    data?._embedded?.guestcastcredits,
    (item) => item._links.episode.href
  );
  const castCreditLinks = map(
    data?._embedded?.castcredits,
    (item) => item._links.show.href
  );

  const { isLoading: isLoadingEpisodes, data: episodes } =
    useBatchFetch<TvEpisodeDetail>(slice(guestCastLinks, 0, 5));
  const { isLoading: isLoadingShows, data: shows } =
    useBatchFetch<TvShowDetail>(slice(castCreditLinks, 0, 5));

  return (
    <ParallaxFlatList
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
      <TitleRow name={data?.name} />
      {data?.birthday && (
        <Text style={{ color: "#ddd", fontSize: 14 }}>
          Born on {""}
          {new Date(data.birthday).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      )}
      {isLoadingShows && isEmpty(shows) && <ListItemSkeleton />}
      {!isLoadingShows && size(shows) > 0 && (
        <>
          <SectionTitle text="Cast" />
          <Animated.FlatList
            horizontal
            data={shows}
            keyExtractor={(item) => toString(item.id)}
            renderItem={({ item }) => (
              <ListItem
                variant="cast"
                item={item}
                href={`../shows/${item.id}`}
                style={{ marginRight: 16 }}
                onPress={() =>
                  dispatch(
                    addRecently({
                      type: "shows",
                      id: item.id,
                      image: item.image,
                      name: item.name,
                    })
                  )
                }
              />
            )}
          />
        </>
      )}
      {isLoadingEpisodes && isEmpty(episodes) && <ListItemSkeleton />}
      {!isLoadingEpisodes && size(episodes) > 0 && (
        <>
          <SectionTitle text="Guest Cast" />
          <Animated.FlatList
            horizontal
            data={episodes}
            keyExtractor={(item) => toString(item.id)}
            renderItem={({ item }) => (
              <View style={{ marginRight: 16 }}>
                <ListItem
                  variant="cast"
                  item={item}
                  href={`../episodes/${item.id}`}
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
                />
                <Link
                  href={`../shows/${last(split(item._links.show.href, "/"))}`}
                  style={{ marginRight: 16 }}
                >
                  <Text style={{ color: "#ddd", marginTop: 8 }}>
                    {item._links.show.name}
                  </Text>
                </Link>
              </View>
            )}
          />
        </>
      )}
      <RecentlyViewed
        style={{ marginTop: 24 }}
        variant="people"
        currentId={id as string}
      />
    </ParallaxFlatList>
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
