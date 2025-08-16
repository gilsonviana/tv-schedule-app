import { searchQueryUrl } from "@/constants/ApiRoutes";
import { TvSearchResult } from "@/constants/Types";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useMemo, useRef, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { PillButton } from "@/components/ui/PillButton";
import { Picker } from "@react-native-picker/picker";
import { map } from "lodash";
import { MessageBox } from "@/components/ui/MessageBox";
import { SearchListItem } from "@/components/ui/SearchListItem";

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
            <SearchListItem isShows={isShows} {...item} />
          )}
        />
      </KeyboardAvoidingView>
    </>
  );
}
