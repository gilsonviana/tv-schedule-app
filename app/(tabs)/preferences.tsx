import { ActionRow } from "@/components/ui/ActionRow";
import { useBiometrics } from "@/components/provider/Biometrics";
import store, { deleteState } from "@/store";
import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "@/components/provider/Toasts";

export default function TabPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const [clearAll, setClearAll] = useState(false);
  const { biometricPreference, toggleBiometricPreference } = useBiometrics();
  const { addToast } = useToast();

  useEffect(() => {
    const clearAllData = async () => {
      const deleted = await deleteState();
      store.dispatch({ type: "RESET" });
      setClearAll(!deleted);
      addToast({
        message: "Data cleared",
      });
    };
    if (clearAll) {
      clearAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearAll]);

  return (
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
  );
}
