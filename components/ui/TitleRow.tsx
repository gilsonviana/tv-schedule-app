import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { FavoriteButton } from "./FavoriteButton";
import { toNumber, toString } from "lodash";
import { TvImageObj } from "@/constants/Types";

interface TitleRowProps {
  name?: string;
  style?: ViewStyle;
}
interface TitleRowProps {
  name?: string;
  number?: number;
}
interface TitleRowProps {
  name?: string;
  number?: number;
  favoriteType?: "shows" | "episodes";
  id?: string | number;
  image?: TvImageObj;
}

export const TitleRow = ({
  name,
  number,
  image,
  id,
  style,
  favoriteType,
}: TitleRowProps) => {
  return (
    <View style={[styles.container, style]} testID="title-row">
      <Text style={styles.text}>{number ? `${number}. ${name}` : name}</Text>
      {favoriteType && image && (
        <FavoriteButton
          type={favoriteType}
          id={toNumber(id)}
          image={image}
          name={toString(name)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    flex: 1,
    color: "#fff",
    fontWeight: "700",
    fontSize: 32,
  },
});
