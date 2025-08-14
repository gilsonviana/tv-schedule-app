import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { getTvEpisodeById } from "@/constants/ApiRoutes";
import { TvShowEpisode } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { toString } from "lodash";

export default function ShowsEpisodeDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data } = useCustomSWR<TvShowEpisode>(getTvEpisodeById(toString(id)));

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
    ></ParallaxScrollView>
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
