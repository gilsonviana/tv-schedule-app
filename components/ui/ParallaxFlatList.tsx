import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, ViewStyle, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";

const HEADER_HEIGHT = 450;

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  style?: ViewStyle;
}>;

export const ParallaxFlatList = ({
  children,
  headerImage,
  headerBackgroundColor,
  style,
}: Props) => {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.FlatList<any>>();

  // ✅ Track scroll position manually
  const scrollOffset = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={scrollRef}
        data={[]} // no items, only header
        keyExtractor={(_, index) => index.toString()}
        renderItem={null}
        scrollEventThrottle={16}
        onScroll={onScroll} // ✅ hook up scroll handler
        ListHeaderComponent={
          <>
            {headerImage && (
              <Animated.View
                style={[
                  styles.header,
                  { backgroundColor: headerBackgroundColor[colorScheme] },
                  headerAnimatedStyle,
                ]}
              >
                {headerImage}
              </Animated.View>
            )}
            <Animated.View style={[styles.content, style]}>
              {children}
            </Animated.View>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});
