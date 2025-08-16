import { searchQueryUrl } from "@/constants/ApiRoutes";
import { TvSearchResult } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated from "react-native-reanimated";
import { Image } from "expo-image";
import { blurhash } from "@/constants/Misc";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GenreBadges } from "@/components/ui/GenreBadges";
import Feather from "@expo/vector-icons/Feather";
import { CollapsibleText } from "@/components/ui/CollapsibleText";
import { Link } from "expo-router";
import { useDispatch } from "react-redux";
import { addRecently } from "@/store/reducers/recently";
import { useMemo, useRef, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { PillButton } from "@/components/ui/PillButton";
import { Picker } from "@react-native-picker/picker";
import { map } from "lodash";
import { MessageBox } from "@/components/ui/MessageBox";

const FILTER_OPTIONS = [
  {
    label: "Shows",
    value: "shows",
  },
  {
    label: "People",
    value: "people",
  },
];

export default function SearchScreen() {
  const [filterOption, setFilterOption] = useState<string>("shows");
  const isShows = filterOption === "shows";
  const pickerRef = useRef<Picker<string>>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useCustomSWR<TvSearchResult[]>(
    searchQueryUrl(searchQuery, filterOption),
    {
      wait: 1000,
      enabled: !!searchQuery,
    }
  );
  const dispatch = useDispatch();
  const key = isShows ? "show" : "person";

  const ListHeader = useMemo(
    () => (
      <View style={{ marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "#555",
              marginTop: insets.top + 34,
              borderRadius: 6,
              paddingInline: 8,
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Feather name="search" size={28} color="#ddd" />
            <TextInput
              placeholderTextColor="#ddd"
              style={{ color: "#fff", fontSize: 16, flex: 1 }}
              placeholder="Type something..."
              clearButtonMode="while-editing"
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              returnKeyType="search"
              autoFocus
            />
          </View>
        </View>
        <View style={{ alignItems: "flex-start" }}>
          <PillButton
            onPress={() => pickerRef.current?.focus()}
            text={`Filter: ${filterOption}`}
          />
        </View>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterOption, searchQuery]
  );

  const RenderEmptyList = () => {
    if (!searchQuery) {
      return (
        <MessageBox
          style={{ marginTop: 8 }}
          text="Start typing to search your next favorite TV shows."
        />
      );
    }

    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <View
          key={`skeleton-${i}`}
          style={{ flexDirection: "row", marginBottom: 16 }}
        >
          <Skeleton width={90} height={150} />
          <View style={{ marginLeft: 16 }}>
            <Skeleton width={90} height={24} style={{ marginVertical: 8 }} />
            <Skeleton width={120} height={24} />
            <Skeleton width={150} height={64} style={{ marginTop: 8 }} />
          </View>
        </View>
      ));
    }

    if (!isLoading && searchQuery) {
      return (
        <MessageBox
          style={{ marginTop: 8 }}
          text={`No results find for the keywork: "${searchQuery}"`}
        />
      );
    }
  };

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
        selectedValue={filterOption}
        onValueChange={(itemValue) => setFilterOption(itemValue)}
      >
        {map(FILTER_OPTIONS, (filterOpt) => (
          <Picker.Item
            key={filterOpt.label}
            label={filterOpt.label}
            value={filterOpt.value}
          />
        ))}
      </Picker>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Animated.FlatList
          style={{ backgroundColor: "#000", paddingTop: 16 }}
          contentContainerStyle={{ paddingInline: 16 }}
          data={data}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={<RenderEmptyList />}
          renderItem={({ item }) => (
            <Link
              style={{ marginBottom: 16 }}
              href={`/home/shows/${item?.[key]?.id}`}
              onPress={() =>
                isShows &&
                dispatch(
                  addRecently({
                    type: "shows",
                    id: item?.show?.id,
                    image: item?.show?.image,
                    name: item?.show?.name,
                  })
                )
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                }}
              >
                {isShows && (
                  <Image
                    style={styles.episodeImage}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    contentPosition="top center"
                    source={
                      item?.show?.image?.original ?? item?.show?.image?.medium
                    }
                  />
                )}
                <View style={{ flex: 3 }}>
                  <Text
                    style={{
                      color: "#fff",
                      marginVertical: 8,
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    {item?.[key]?.name}
                  </Text>
                  {item?.show?.genres && (
                    <GenreBadges genres={item?.show.genres} />
                  )}
                  {item?.show?.summary && (
                    <CollapsibleText
                      containerStyle={{
                        marginTop: 8,
                        backgroundColor: "#000",
                      }}
                      textStyle={{
                        color: "#fff",
                        fontSize: 14,
                      }}
                      text={item.show.summary}
                    />
                  )}
                </View>
              </View>
            </Link>
          )}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  episodeImage: {
    flex: 1,
    height: 195,
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 6,
  },
});
