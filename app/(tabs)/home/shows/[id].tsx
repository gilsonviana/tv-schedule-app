import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getTvShowById } from "@/constants/ApiRoutes";
import { TvShowDetail } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useLocalSearchParams } from "expo-router";
import { toString } from "lodash";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { GenreBadges } from "@/components/GenreBadges";

export default function ShowsDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data: showData } = useCustomSWR<TvShowDetail>(getTvShowById(toString(id)));

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          style={styles.image}
          source={showData?.image.original ?? showData?.image.medium}
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
        {showData?.name}
      </ThemedText>
      <GenreBadges genres={showData?.genres} />
      <ThemedText style={{ color: "#fff" }}>{showData?.summary}</ThemedText>
      {showData?._embedded?.cast && (
        <>
          <ThemedText
            style={{
              fontWeight: "700",
              fontSize: 21,
              marginBottom: 8,
              color: "#fff",
            }}
          >
            Cast
          </ThemedText>
          <Animated.FlatList
            horizontal
            data={showData?._embedded?.cast}
            keyExtractor={(item) => toString(item.character.id)}
            renderItem={({ item }) => (
              <ThemedView style={{ marginRight: 16, backgroundColor: "#000" }}>
                <Image
                  style={styles.image}
                  source={item.person.image.original || item.person.image.medium}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  contentPosition="top center"
                />
                <ThemedText style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}>
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 295,
    minWidth: 200,
    width: "100%",
    backgroundColor: "#0553",
  },
});
