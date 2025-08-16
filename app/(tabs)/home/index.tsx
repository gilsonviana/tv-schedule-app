import { SectionList, View, Text } from "react-native";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { getTvShows } from "@/constants/ApiRoutes";
import { isEmpty, shuffle, slice, toString } from "lodash";
import { TvShow } from "@/constants/Types";
import Animated from "react-native-reanimated";
import { Link } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import Feather from "@expo/vector-icons/Feather";
import { addRecently } from "@/store/reducers/recently";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReduxHydrate } from "@/hooks/useReduxHydrate";
import { ListItem } from "@/components/ui/ListItem";
import { useBiometrics } from "@/components/provider/Biometrics";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function HomeScreen() {
  const { shows: recentlyShows } = useSelector(
    (state: RootState) => state.recently
  );
  const { hasSuccessBiometric } = useBiometrics();
  const { rehydrated } = useReduxHydrate({
    shouldHydrate: hasSuccessBiometric,
  });

  const dispatch = useDispatch();
  const { data } = useCustomSWR<TvShow[]>(getTvShows());
  const suffledData = shuffle(data);

  const sections = [
    {
      title: "Must-See Picks of the Day",
      data: slice(suffledData, 0, 10),
    },
    {
      title: "Trending & Hidden Gems",
      data: slice(suffledData, 10, 20),
    },
  ];

  if (!isEmpty(recentlyShows)) {
    sections.unshift({
      title: "Recently Viewed",
      data: recentlyShows as TvShow[],
    });
  }
  const insets = useSafeAreaInsets();

  return (
    <SectionList
      style={{
        flex: 1,
        backgroundColor: "#000",
        paddingInline: 16,
      }}
      keyExtractor={(item) => toString(item.id)}
      ListHeaderComponent={() => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: insets.top * 2,
            paddingTop: insets.top,
            paddingBottom: insets.top / 2,
          }}
        >
          <Text style={{ color: "#ddd", fontWeight: "900", fontSize: 28 }}>
            Welcome, Jobsity
          </Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Link href="/home/favorites">
              <View>
                <Feather name="list" size={28} color="#ddd" />
              </View>
            </Link>
            <Link href="/home/search">
              <Feather name="search" size={28} color="#ddd" />
            </Link>
          </View>
        </View>
      )}
      renderSectionHeader={({ section }) => (
        <>
          <SectionTitle text={section.title} />
          <Animated.FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ backgroundColor: "#000" }}
            style={{ backgroundColor: "#000" }}
            data={section.data}
            keyExtractor={(item) => toString(item.id)}
            renderItem={({ item }) => (
              <ListItem
                href={`/home/shows/${item.id}`}
                item={item}
                style={{
                  paddingInline: 16,
                }}
                onPress={() =>
                  dispatch(
                    addRecently({
                      type: "shows",
                      id: item.id,
                      image: item.image,
                      name: item.name,
                    })
                  )
                }
              />
            )}
          />
        </>
      )}
      renderItem={() => <></>}
      sections={sections}
    />
  );
}
