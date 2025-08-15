import { useState } from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  Text,
  View,
} from "react-native";
import { slice } from "lodash";

interface CollapsibleTextProps {
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  text: string;
}

const MAX_CHARACTERS = 120;

export const CollapsibleText = ({
  containerStyle,
  textStyle,
  text,
}: CollapsibleTextProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const strippedText = text?.replace(/<[^>]*>?/gm, "");
  const clippedText = slice(strippedText, 0, MAX_CHARACTERS);
  const remainderText = slice(strippedText, MAX_CHARACTERS);

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Text style={[styles.textContent, textStyle]}>
          {clippedText}
          {isOpen ? (
            remainderText
          ) : (
            <Text style={styles.readMore}>...read more</Text>
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textContent: {
    minWidth: 1,
    fontSize: 16,
    lineHeight: 18
  },
  readMore: {
    fontWeight: "700",
    color: "#fff",
  },
});
