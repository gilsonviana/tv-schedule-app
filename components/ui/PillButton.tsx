import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface PillButtonProps {
  onPress?: VoidFunction;
  text: string;
}

export const PillButton = ({ onPress, text }: PillButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 32,
    backgroundColor: "#222",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
