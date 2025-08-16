import { View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { TvShow, TvShowCast } from "@/constants/Types";
import { blurhash } from "@/constants/Misc";
import { Link, LinkProps } from "expo-router";
import { includes } from "lodash";

type ItemBaseProps = TvShow & TvShowCast;

interface ItemProps extends ItemBaseProps {
  variant:
    | "shows"
    | "people"
    | "episodes"
    | "cast"
    | "guest"
    | "recently-people";
}

interface ListItemProps
  extends Pick<LinkProps, "href" | "onPress" | "style">,
    Partial<Pick<ItemProps, "variant">> {
  item: Partial<ItemBaseProps>;
}

const Item = ({
  name,
  image,
  variant,
  person,
  character,
}: Partial<ItemProps>) => {
  const getImageSource = () => {
    if (includes(["people", "guest"], variant)) {
      return person?.image?.original || person?.image?.medium;
    }
    return image?.original || image?.medium;
  };

  const getImageStyle = () => {
    const largeImages = ["shows", "cast"];
    return includes(largeImages, variant) ? styles.largeImage : styles.image;
  };

  return (
    <View>
      <Image
        style={[getImageStyle()]}
        source={getImageSource()}
        placeholder={{ blurhash }}
        contentFit="cover"
        contentPosition="top center"
      />
      {includes(["episodes", "cast", "recently-people"], variant) && (
        <Text style={styles.name}>{name}</Text>
      )}
      {includes(["people", "guest"], variant) && (
        <>
          <Text style={styles.name}>{person?.name}</Text>
          <Text style={{ color: "#ddd", fontSize: 16 }}>{character?.name}</Text>
        </>
      )}
    </View>
  );
};

export const ListItem = ({
  item,
  href,
  style,
  variant = "shows",
  onPress,
}: ListItemProps) => {
  if (href) {
    return (
      <Link href={href} onPress={onPress} style={style}>
        <Item variant={variant} {...item} />
      </Link>
    );
  }

  return <Item variant={variant} {...item} />;
};

const styles = StyleSheet.create({
  name: {
    color: "#fff",
    fontWeight: "700",
    marginTop: 8,
    fontSize: 16,
  },
  image: {
    flex: 1,
    height: 250,
    width: 250,
    aspectRatio: 9 / 16,
    borderRadius: 4,
  },
  largeImage: {
    flex: 1,
    height: 295,
    minWidth: 200,
    width: "100%",
  },
});
