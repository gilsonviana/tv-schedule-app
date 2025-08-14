import { useEffect } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  color?: string;
  highlightColor?: string;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const Skeleton = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  color = "#E1E9EE",
  highlightColor = "#F2F8FC",
  duration = 1000,
  style,
  children,
}: SkeletonProps) => {
  const xOffset = useSharedValue(-150);

  useEffect(() => {
    xOffset.value = withRepeat(
      withTiming(150, {
        duration,
        easing: Easing.linear,
      }),
      -1, // Infinite repetition
      false
    );
  }, [duration, xOffset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xOffset.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius, backgroundColor: color },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.highlight,
          { backgroundColor: highlightColor },
          animatedStyle,
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "40%",
    height: "100%",
    opacity: 0.4,
  },
});

export default Skeleton;
