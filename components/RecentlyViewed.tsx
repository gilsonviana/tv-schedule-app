import { View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { filter, isEmpty, toNumber, toString } from "lodash";
import { ListItem } from "./ListItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { SectionTitle } from "./SectionTitle";

interface RecentlyViewedProps {
  variant?: "shows" | "episodes" | "people";
  currentId?: string | number;
  style?: ViewStyle;
}

export const RecentlyViewed = ({
  currentId,
  style,
  variant = "shows",
}: RecentlyViewedProps) => {
  const recentlyData = useSelector((state: RootState) => state.recently);

  const filteredData = filter(
    recentlyData[variant],
    (item) => item.id !== toNumber(currentId)
  );

  if (isEmpty(recentlyData)) {
    return null;
  }

  return (
    <View style={style}>
      <SectionTitle text="Recently Viewed" />
      <Animated.FlatList
        horizontal
        data={filteredData}
        keyExtractor={(item) => toString(item.id)}
        renderItem={({ item }) => (
          <ListItem
            variant={variant === "people" ? "recently-people" : variant}
            item={item}
            href={`/home/${variant}/${item.id}`}
            style={{ marginRight: 16 }}
          />
        )}
      />
    </View>
  );
};
