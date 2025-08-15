import { RootState } from "@/store/reducers";
import { toggleRequestBiometric } from "@/store/reducers/user";
import { SafeAreaView, ScrollView, Text, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function TabPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const userPreferences = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{
          backgroundColor: "#000",
          paddingTop: insets.top,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: "#ddd", fontWeight: "900", fontSize: 28 }}>
          Preferences
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ddd", fontSize: 18 }}>Request Biometric</Text>
          <Switch
            trackColor={{ true: "#555", false: "#555" }}
            onValueChange={() => dispatch(toggleRequestBiometric())}
            value={userPreferences.requestBiometric}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
