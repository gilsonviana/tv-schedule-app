import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface BadgeProps {
  text: string;
  style?: ViewStyle;
  outlined?: boolean;
}

export const Badge = ({ text, outlined, style }: BadgeProps) => {
  return (
    <View style={[styles.container, outlined ? styles.outlined : {}, style]}>
      <Text style={[styles.text, outlined ? styles.textOutlined : {}]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    alignItems: "flex-start",
    backgroundColor: "#aaa",
    padding: 6,
  },
  outlined: {
    borderWidth: 2,
    borderColor: "#aaa",
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  textOutlined: {
    color: "#aaa",
  },
});
