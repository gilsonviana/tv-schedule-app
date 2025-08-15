import store, { getState, PERSIST_KEY } from "@/store";
import { useEffect, useState } from "react";

interface UseReduxHydrateParams {
  shouldHydrate?: boolean;
}

export const useReduxHydrate = ({ shouldHydrate }: UseReduxHydrateParams) => {
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    const hydrateStore = async () => {
      const persistedState = await getState(PERSIST_KEY);
      if (persistedState) {
        store.dispatch({ type: "HYDRATE", payload: persistedState });
      }
      setRehydrated(true);
    };
    if (shouldHydrate && !rehydrated) {
      hydrateStore();
    }
  }, [rehydrated, shouldHydrate]);

  return {
    rehydrated
  }
};
