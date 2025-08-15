import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

interface UseBiometricsParams {
  shouldPromptBiometric?: boolean;
}

export const useBiometrics = ({
  shouldPromptBiometric,
}: UseBiometricsParams) => {
  const [hasBiometricSupport, setHasBiometricSupport] = useState<boolean>();
  const [hasSavedBiometric, setHasSavedBiometric] = useState<boolean>();
  const [hasSuccessBiometric, setHasSuccessBiometric] = useState<boolean>();

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
    if (shouldPromptBiometric && hasBiometricSupport && !hasSavedBiometric) {
      promptBiometric();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPromptBiometric, hasBiometricSupport, hasSavedBiometric]);

  return {
    hasSavedBiometric,
    hasSuccessBiometric,
  };
};
