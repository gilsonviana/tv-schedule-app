import { Text, StyleSheet } from "react-native";

interface SectionTitleProps {
  text: string;
}

export const SectionTitle = ({ text }: SectionTitleProps) => {
  return <Text style={styles.text}>{text}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "700",
    fontSize: 21,
    marginTop: 24,
    marginBottom: 8,
    color: "#fff",
  },
});
