import { getTvShows } from "@/constants/ApiRoutes";
import { TvShow } from "@/constants/Types";
import Animated from "react-native-reanimated";
import { toString } from "lodash";
import { useCustomInfineSWR } from "@/hooks/useCustomSWR";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SearchListItem,
  SearchListItemSkeleton,
} from "@/components/ui/SearchListItem";

export default function TabExploreScreen() {
  const insets = useSafeAreaInsets();
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
      renderItem={({ item }) => <SearchListItem isShows show={item} />}
      ListFooterComponent={() =>
        isValidating || (isLoading && <SearchListItemSkeleton />)
      }
    />
  );
}
