import { StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { getTvPeopleById } from "@/constants/ApiRoutes";
import {
  TvEpisodeDetail,
  TvShowDetail,
  TvShowPeopleDetail,
} from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import {
  filter,
  isEmpty,
  last,
  map,
  size,
  slice,
  split,
  toNumber,
  toString,
} from "lodash";
import { ThemedText } from "@/components/ThemedText";
import Animated from "react-native-reanimated";
import Skeleton from "@/components/Skeleton";
import { useBatchFetch } from "@/hooks/useBatchFetch";
import { blurhash } from "@/constants/Misc";
import { RootState } from "@/store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { addRecently } from "@/store/reducers/recently";
import { ListItem } from "@/components/ListItem";

export default function PeopleDetailScreen() {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const { data } = useCustomSWR<TvShowPeopleDetail>(
    getTvPeopleById(toString(id))
  );
  const { people: recentlyPeople } = useSelector(
    (state: RootState) => state.recently
  );

  const filteredRecentlyPeople = filter(
    recentlyPeople,
    (people) => people.id !== toNumber(id)
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
      <ThemedText
        style={{
          color: "#fff",
          fontWeight: "700",
          fontSize: 32,
          lineHeight: 32,
        }}
      >
        {data?.name}
      </ThemedText>
      {data?.birthday && (
        <ThemedText style={{ color: "#ddd", fontSize: 14 }}>
          Born on {""}
          {new Date(data.birthday).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </ThemedText>
      )}
      {isLoadingShows && isEmpty(shows) && (
        <>
          <Skeleton width={120} height={24} />
          <View style={{ flexDirection: "row" }}>
            <Skeleton width={125} height={195} style={{ marginRight: 16 }} />
            <Skeleton width={125} height={195} style={{ marginRight: 16 }} />
            <Skeleton width={125} height={195} />
          </View>
        </>
      )}
      {!isLoadingShows && size(shows) > 0 && (
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
              // <Link
              //   href={`../shows/${item.id}`}
              //   style={{ marginRight: 16 }}
              //   onPress={() =>
              //     dispatch(
              //       addRecently({
              //         type: "shows",
              //         id: item.id,
              //         image: item.image,
              //         name: item.name,
              //       })
              //     )
              //   }
              // >
              //   <View>
              //     <Image
              //       source={item?.image?.original ?? item?.image?.medium}
              //       style={styles.image}
              //       placeholder={{ blurhash }}
              //       contentFit="cover"
              //       contentPosition="top center"
              //     />
              //     <ThemedText
              //       style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}
              //     >
              //       {item.name}
              //     </ThemedText>
              //   </View>
              // </Link>
            )}
          />
        </>
      )}
      {isLoadingEpisodes && isEmpty(episodes) && (
        <>
          <Skeleton width={120} height={24} />
          <View style={{ flexDirection: "row" }}>
            <Skeleton width={125} height={195} style={{ marginRight: 16 }} />
            <Skeleton width={125} height={195} style={{ marginRight: 16 }} />
            <Skeleton width={125} height={195} />
          </View>
        </>
      )}
      {!isLoadingEpisodes && size(episodes) > 0 && (
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
            data={episodes}
            keyExtractor={(item) => toString(item.id)}
            renderItem={({ item }) => (
              <View style={{ marginRight: 16 }}>
                <ListItem
                  variant="guest"
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
                  <ThemedText style={{ color: "#ddd", marginTop: 8 }}>
                    {item._links.show.name}
                  </ThemedText>
                </Link>
              </View>
            )}
          />
        </>
      )}
      {!isEmpty(filteredRecentlyPeople) && (
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
            data={filteredRecentlyPeople}
            keyExtractor={(item) => toString(item.id)}
            renderItem={({ item }) => (
              <View style={{ marginRight: 16 }}>
                <Link href={`../people/${item.id}`}>
                  <View>
                    <Image
                      source={item?.image?.original ?? item?.image?.medium}
                      style={styles.image}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      contentPosition="top center"
                    />
                    <ThemedText
                      style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}
                    >
                      {item.name}
                    </ThemedText>
                  </View>
                </Link>
              </View>
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
