import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { getState, saveState } from "@/store";

export const useBiometrics = () => {
  const [biometricPreference, setBiometricPreference] = useState<boolean>();
  const [hasBiometricSupport, setHasBiometricSupport] = useState<boolean>();
  const [hasSavedBiometric, setHasSavedBiometric] = useState<boolean>();
  const [hasSuccessBiometric, setHasSuccessBiometric] = useState<boolean>();

  const toggleBiometricPreference = async () => {
    await saveState("biometricPreference", !biometricPreference);
    setBiometricPreference(!biometricPreference);
  };

  useEffect(() => {
    const fetchBiometricPreference = async () => {
      const biometricPreference = await getState<boolean>(
        "biometricPreference"
      );
      setBiometricPreference(biometricPreference);
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
    const verifySavedBiometric = async () => {
      const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
      setHasSavedBiometric(isBiometricEnrolled);
    };
    if (hasBiometricSupport) {
      verifySavedBiometric();
    }
  }, [hasBiometricSupport]);

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
    if (biometricPreference && hasBiometricSupport && !hasSavedBiometric) {
      promptBiometric();
    }
  }, [biometricPreference, hasBiometricSupport, hasSavedBiometric]);

  return {
    hasSavedBiometric,
    hasSuccessBiometric,
    biometricPreference,
    toggleBiometricPreference,
  };
};
