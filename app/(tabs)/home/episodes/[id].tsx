import { StyleSheet, Text, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { getTvEpisodeById } from "@/constants/ApiRoutes";
import { TvEpisodeDetail } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { isEmpty, toString } from "lodash";
import { StrippedText } from "@/components/ui/StrippedText";
import { Badge } from "@/components/ui/Badge";
import Animated from "react-native-reanimated";
import { blurhash } from "@/constants/Misc";
import { ListItem } from "@/components/ui/ListItem";
import { useDispatch } from "react-redux";
import { addRecently } from "@/store/reducers/recently";
import { TitleRow } from "@/components/ui/TitleRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RecentlyViewed } from "@/components/ui/RecentlyViewed";

export default function ShowsEpisodeDetailScreen() {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const { data } = useCustomSWR<TvEpisodeDetail>(
    getTvEpisodeById(toString(id))
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
      <TitleRow
        name={data?.name}
        number={data?.number}
        id={id as string}
        favoriteType="episodes"
        image={data?.image}
      />
      <View style={{ flexDirection: "row" }}>
        <Badge text={`Season ${data?.season}`} />
      </View>
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
      <StrippedText style={{ color: "#fff" }}>
        {data?.summary}
      </StrippedText>
      {!isEmpty(data?._embedded?.guestcast) && (
        <>
          <SectionTitle text="Guest Cast" />
          <Animated.FlatList
            horizontal
            data={data?._embedded?.guestcast}
            keyExtractor={(item) => toString(item.character.id)}
            renderItem={({ item }) => (
              <ListItem
                variant="guest"
                item={item}
                href={`/home/people/${item.person.id}`}
                style={{ marginRight: 16 }}
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
      <RecentlyViewed
        style={{ marginTop: 24 }}
        variant="episodes"
        currentId={id as string}
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
});
