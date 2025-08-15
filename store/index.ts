import { configureStore, Middleware } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import * as SecureStore from "expo-secure-store";

export async function saveState<T>(key: string, state: T): Promise<void> {
  try {
    const serializedState = JSON.stringify(state);
    await SecureStore.setItemAsync(key, serializedState);
  } catch (error) {
    console.error("Error saving state to SecureStore", error);
  }
}

export async function getState<T>(key: string): Promise<T | undefined> {
  try {
    const serializedState = await SecureStore.getItemAsync(key);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.error("Error retrieving state from SecureStore", error);
    return undefined;
  }
}

export const PERSIST_KEY = "reduxState";

export const persistMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    const result = next(action);
    saveState(PERSIST_KEY, storeAPI.getState());
    return result;
  };

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export default store;
