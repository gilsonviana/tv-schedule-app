import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const StrippedText = ({
  style,
  lightColor,
  darkColor,
  type = "default",
  children,
}: ThemedTextProps) => {
  return (
    <Text style={style}>
      {typeof children == "string" ? stripHtml(children) : children}
    </Text>
  );
};
