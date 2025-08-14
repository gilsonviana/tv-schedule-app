import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { getTvPeopleById } from "@/constants/ApiRoutes";
import { TvShowPeopleDetail } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { toString } from "lodash";
import { ThemedText } from "@/components/ThemedText";
import { Badge } from "@/components/Badge";
import { ThemedView } from "@/components/ThemedView";
import Animated from "react-native-reanimated";

export default function PeopleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data } = useCustomSWR<TvShowPeopleDetail>(
    getTvPeopleById(toString(id))
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
      {/* {data?.airdate && (
        <ThemedText style={{ color: "#ddd", fontSize: 14 }}>
          Aired on {""}
          {new Date(data.airdate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </ThemedText>
      )} */}
      {/* <ThemedText stripped style={{ color: "#fff" }}>
        {data?.summary}
      </ThemedText>
      {data?._embedded?.guestcast && (
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
              <ThemedView style={{ marginRight: 16, backgroundColor: "#000" }}>
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
            )}
          />
        </>
      )} */}
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
