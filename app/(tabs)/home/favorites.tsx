import { SectionList, View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { Link } from "expo-router";
import { isEmpty, map, toString } from "lodash";
import { blurhash } from "@/constants/Misc";
import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import { PillButton } from "@/components/ui/PillButton";
import { MessageBox } from "@/components/ui/MessageBox";
import { SectionTitle } from "@/components/ui/SectionTitle";

const SORT_OPTIONS = [
  {
    label: "Ascend",
    value: "asc",
  },
  {
    label: "Descend",
    value: "desc",
  },
  {
    label: "In Order",
    value: "order",
  },
];

export default function FavoriteScreen() {
  const pickerRef = useRef<Picker<string>>(null);
  const [sortOption, setSortOption] = useState<string>("order");
  const { favoriteShows, favoriteEpisodes } = useSelector(
    (state: RootState) => state.favorites
  );
  const insets = useSafeAreaInsets();

  const sections = [];

  if (!isEmpty(favoriteShows)) {
    let sortedShows = [...(favoriteShows ?? [])];
    if (sortOption === "asc") {
      sortedShows.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "desc") {
      sortedShows.sort((a, b) => b.name.localeCompare(a.name));
    }
    sections.push({
      title: "Shows",
      data: sortedShows,
    });
  }

  if (!isEmpty(favoriteEpisodes)) {
    let sortedEpisodes = [...(favoriteEpisodes ?? [])];
    if (sortOption === "asc") {
      sortedEpisodes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "desc") {
      sortedEpisodes.sort((a, b) => b.name.localeCompare(a.name));
    }
    sections.push({
      title: "Episodes",
      data: sortedEpisodes,
    });
  }

  return (
    <>
      <Picker
        ref={(ref) => {
          pickerRef.current = ref;
        }}
        style={{
          display: "none",
          backgroundColor: "#aaa",
          color: "#fff",
        }}
        itemStyle={{
          color: "#fff",
        }}
        selectionColor="#fff"
        mode="dialog"
        selectedValue={sortOption}
        onValueChange={(itemValue) => setSortOption(itemValue)}
      >
        {map(SORT_OPTIONS, (sortOpt) => (
          <Picker.Item
            key={sortOpt.label}
            label={sortOpt.label}
            value={sortOpt.value}
          />
        ))}
      </Picker>
      <SectionList
        sections={sections as any[]}
        style={{
          flex: 1,
          backgroundColor: "#000",
          paddingTop: 16,
        }}
        contentContainerStyle={{
          paddingInline: 16,
          paddingBottom: 100,
        }}
        keyExtractor={(item) => toString(item.id)}
        ListHeaderComponent={() => (
          <View style={{ marginTop: insets.top + 34 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#ddd", fontWeight: "900", fontSize: 28 }}>
                Your Favorites
              </Text>
            </View>
            <View style={{ alignItems: "flex-start", marginTop: 16 }}>
              <PillButton
                onPress={() => pickerRef.current?.focus()}
                text={`Sort: ${sortOption}`}
              />
            </View>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <>
            <SectionTitle text={section.title} />
            <Animated.FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={section.data}
              keyExtractor={(item) => toString(item.id)}
              renderItem={({ item }) => (
                <Link href={`/home/shows/${item.id}`}>
                  <View
                    style={{
                      paddingInline: 16,
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={item.image.medium}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                    />
                    <Text
                      style={{ color: "#fff", fontWeight: "700", marginTop: 8 }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </Link>
              )}
            />
          </>
        )}
        renderItem={() => <></>}
        ListEmptyComponent={() => (
          <MessageBox
            style={{ marginTop: 24 }}
            text="Ops, it looks like you haven't add any favorite show or episode yet."
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 250,
    width: 250,
    aspectRatio: 9 / 16,
    borderRadius: 4,
  },
});
