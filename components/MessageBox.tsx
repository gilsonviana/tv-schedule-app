import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface MessageBoxProps {
  text: string;
  style?: ViewStyle;
}

export const MessageBox = ({ text, style }: MessageBoxProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: "#222",
    padding: 24,
    borderRadius: 6,
  },
  text: {
    color: "#ddd",
    fontSize: 18,
  },
});
