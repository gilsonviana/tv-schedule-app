import { ActionRow } from "@/components/ActionRow";
import { useBiometrics } from "@/hooks/useBiometrics";
import store, { deleteState } from "@/store";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const [clearAll, setClearAll] = useState(false);
  const { biometricPreference, toggleBiometricPreference } = useBiometrics();

  useEffect(() => {
    const clearAllData = async () => {
      const deleted = await deleteState();
      store.dispatch({ type: "RESET" });
      setClearAll(!deleted);
    };
    if (clearAll) {
      clearAllData();
    }
  }, [clearAll]);

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
        <ActionRow
          label="Request Biometric"
          toggle
          value={biometricPreference}
          onValueChange={() => void toggleBiometricPreference()}
        />
        <ActionRow
          label="Clear all data"
          toggle
          value={clearAll}
          onValueChange={() => setClearAll(true)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
