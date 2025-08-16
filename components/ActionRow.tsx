import { View, Text, Switch, StyleSheet } from "react-native";

interface ActionRowProps {
  label?: string;
}
interface ActionRowProps {
  toggle: true;
  value?: boolean;
  onValueChange?: VoidFunction;
}

export const ActionRow = ({
  label,
  toggle,
  value,
  onValueChange,
}: ActionRowProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      {toggle && (
        <Switch
          trackColor={{ true: "#555", false: "#555" }}
          onValueChange={onValueChange}
          value={value}
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
    color: "#ddd",
    fontSize: 18,
  },
});
