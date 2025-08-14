import { isEmpty, map } from "lodash";
import { View, StyleSheet } from "react-native";
import { Badge } from "./Badge";

interface GenreBadgeProps {
  genres?: string[];
}

const colorMap: Record<string, string> = {
  Drama: "#77DD77",
  Crime: "#E97451",
  Thriller: "#FFA07A",
  Anime: "#FF9F80",
  Horror: "#FF6B6B",
  Supernatural: "#C3B1E1",
  Family: "#98FF98",
  Romance: "#FFB6C1",
  "Science-Fiction": "#7EC8E3",
  Adventure: "#FF6961",
  Comedy: "#FFD700",
};

export const GenreBadges = ({ genres }: GenreBadgeProps) => {
  if (isEmpty(genres)) {
    return <></>;
  }

  return (
    <View style={styles.wrapper}>
      {map(genres, (genre) => (
        <Badge
          key={genre}
          text={genre}
          style={{ backgroundColor: colorMap[genre] ?? "gray" }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
