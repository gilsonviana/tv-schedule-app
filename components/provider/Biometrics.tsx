import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { getState, saveState } from "@/store";

type BiometricsContextType = {
  biometricPreference?: boolean;
  hasSuccessBiometric: boolean;
  toggleBiometricPreference: () => Promise<void>;
};

const BiometricsContext = createContext<BiometricsContextType | undefined>(
  undefined
);

export const BiometricsProvider = ({ children }: { children: ReactNode }) => {
  const [biometricPreference, setBiometricPreference] = useState<boolean>();
  const [hasSuccessBiometric, setHasSuccessBiometric] =
    useState<boolean>(false);
  const [hasBiometricSupport, setHasBiometricSupport] = useState<boolean>();

  // Doc: switch biometric preference (on/off)
  const toggleBiometricPreference = async () => {
    await saveState("biometricPreference", !biometricPreference);
    setBiometricPreference(!biometricPreference);
  };

  useEffect(() => {
    const fetchBiometricPreference = async () => {
      const biometricPreference = await getState<boolean>(
        "biometricPreference"
      );
      console.log("BiometricsProvider --->", {
        biometricPreference,
        newValue: biometricPreference ?? false,
      });
      if (!biometricPreference) {
        await saveState("biometricPreference", true);
      }
      setBiometricPreference(biometricPreference ?? false);
    };
    fetchBiometricPreference();
  }, []);

  useEffect(() => {
    const verifyBiometricSupport = async () => {
      const isBiometricSupported = await LocalAuthentication.hasHardwareAsync();
      setHasBiometricSupport(isBiometricSupported);
    };
    verifyBiometricSupport();
  }, []);

  useEffect(() => {
    const promptBiometric = async () => {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate",
        fallbackLabel: "Enter Password",
      });
      if (biometricAuth.success === true) {
        setHasSuccessBiometric(biometricAuth.success);
      }
    };
    if (biometricPreference && hasBiometricSupport && !hasSuccessBiometric) {
      promptBiometric();
    }
  }, [biometricPreference, hasBiometricSupport, hasSuccessBiometric]);

  console.log({
    biometricPreference,
    hasBiometricSupport,
    hasSuccessBiometric,
    logic: biometricPreference && hasBiometricSupport && !hasSuccessBiometric,
  });

  return (
    <BiometricsContext.Provider
      value={{
        biometricPreference,
        hasSuccessBiometric,
        toggleBiometricPreference,
      }}
    >
      {children}
    </BiometricsContext.Provider>
  );
};

export const useBiometrics = () => {
  const context = useContext(BiometricsContext);
  if (!context) {
    throw new Error("useBiometrics must be used within a BiometricsProvider");
  }
  return context;
};
