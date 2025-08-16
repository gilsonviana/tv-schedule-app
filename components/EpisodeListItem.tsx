import { TvShowEpisode } from "@/constants/Types";
import { addRecently } from "@/store/reducers/recently";
import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";
import { blurhash } from "@/constants/Misc";

type EpisodeListItemProps = TvShowEpisode;

export const EpisodeListItem = ({
  id,
  image,
  name,
  rating,
  number,
  summary,
}: EpisodeListItemProps) => {
  const dispatch = useDispatch();

  return (
    <Link
      href={`/home/episodes/${id}`}
      style={{ marginBottom: 24 }}
      onPress={() =>
        dispatch(
          addRecently({
            type: "episodes",
            id: id,
            image: image,
            name: name,
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
            source={image?.original ?? image?.medium}
          />
          <View style={{ flex: 2, marginLeft: 8 }}>
            <ThemedText style={{ color: "#fff", fontSize: 14 }}>
              {number}. {name}
            </ThemedText>
            <ThemedText style={{ color: "#fff", marginTop: 8, fontSize: 14 }}>
              Rating: {rating.average}
            </ThemedText>
          </View>
        </View>
        <ThemedText
          stripped
          style={{ color: "#fff", marginTop: 8, fontSize: 14 }}
        >
          {summary}
        </ThemedText>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  episodeImage: {
    flex: 1,
    height: 125,
    width: 195,
    borderRadius: 6,
  },
});
