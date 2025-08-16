import { addRecently } from "@/store/reducers/recently";
import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Image } from "expo-image";
import { CollapsibleText } from "./CollapsibleText";
import { GenreBadges } from "./GenreBadges";
import { TvSearchResult } from "@/constants/Types";
import { blurhash } from "@/constants/Misc";

type SearchListItemBaseProps = TvSearchResult;

interface SearchListItemProps extends SearchListItemBaseProps {
  isShows?: boolean;
}

export const SearchListItem = ({
  isShows,
  show,
  person,
}: SearchListItemProps) => {
  const dispatch = useDispatch();

  return (
    <Link
      style={{ marginBottom: 16 }}
      href={`/home/shows/${isShows ? show?.id : person?.id}`}
      onPress={() =>
        isShows &&
        dispatch(
          addRecently({
            type: "shows",
            id: show?.id,
            image: show?.image,
            name: show?.name,
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
        {isShows && (
          <Image
            style={styles.episodeImage}
            placeholder={{ blurhash }}
            contentFit="cover"
            contentPosition="top center"
            source={show?.image?.original ?? show?.image?.medium}
          />
        )}
        <View style={{ flex: 3 }}>
          <Text
            style={{
              color: "#fff",
              marginVertical: 8,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {isShows ? show?.name : person?.name}
          </Text>
          {show?.genres && <GenreBadges genres={show.genres} />}
          {!!show?.summary && (
            <CollapsibleText
              containerStyle={{
                marginTop: 8,
                backgroundColor: "#000",
              }}
              textStyle={{
                color: "#fff",
                fontSize: 14,
              }}
              text={show.summary}
            />
          )}
        </View>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  episodeImage: {
    flex: 1,
    height: 195,
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 6,
  },
});
