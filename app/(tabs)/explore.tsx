import { getTvShows } from "@/constants/ApiRoutes";
import { TvShow } from "@/constants/Types";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { toString } from "lodash";
import { addRecently } from "@/store/reducers/recently";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "@/constants/Misc";
import { GenreBadges } from "@/components/ui/GenreBadges";
import { CollapsibleText } from "@/components/ui/CollapsibleText";
import { useCustomInfineSWR } from "@/hooks/useCustomSWR";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Skeleton from "@/components/ui/Skeleton";

export default function TabExploreScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { data, isValidating, isLoading, size, setSize } =
    useCustomInfineSWR<TvShow>(getTvShows);

  return (
    <Animated.FlatList
      style={{
        backgroundColor: "#000",
        paddingInline: 16,
        paddingTop: insets.top + 36,
      }}
      data={data}
      keyExtractor={(item) => toString(item.id) + "-" + size}
      onEndReached={() => !isValidating && setSize(size + 1)}
      renderItem={({ item }) => (
        <Link
          style={{ marginBottom: 16 }}
          href={`/home/shows/${item?.id}`}
          onPress={() =>
            dispatch(
              addRecently({
                type: "shows",
                id: item?.id,
                image: item?.image,
                name: item?.name,
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
              source={item?.image?.original ?? item?.image?.medium}
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
                {item?.name}
              </Text>
              {item?.genres && <GenreBadges genres={item.genres} />}
              {item?.summary && (
                <CollapsibleText
                  containerStyle={{
                    marginTop: 8,
                    backgroundColor: "#000",
                  }}
                  textStyle={{
                    color: "#fff",
                    fontSize: 14,
                  }}
                  text={item.summary}
                />
              )}
            </View>
          </View>
        </Link>
      )}
      ListFooterComponent={() =>
        isValidating ||
        (isLoading && (
          <View style={{ flexDirection: "row" }}>
            <Skeleton height={195} width={90} />
            <View style={{ marginLeft: 16 }}>
              <Skeleton height={24} width={80} />
              <Skeleton
                height={24}
                width={120}
                style={{ marginVertical: 16 }}
              />
              <Skeleton height={60} width={160} />
            </View>
          </View>
        ))
      }
    />
  );
}

const styles = StyleSheet.create({
  episodeImage: {
    flex: 1,
    height: 195,
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 6,
  },
});
