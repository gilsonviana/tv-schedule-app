import { combineReducers } from "@reduxjs/toolkit";
import UserReducer, { UserState } from "./user";
import FavoritesReducer, { FavoriteState } from "./favorites";
import RecentlyReducer, { RecentlyState } from "./recently";

const appReducer = combineReducers({
  user: UserReducer,
  favorites: FavoritesReducer,
  recently: RecentlyReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === "HYDRATE") {
    return {
      ...state,
      ...action.payload,
    };
  }
  return appReducer(state, action);
};

export type RootState = {
  user: UserState;
  favorites: FavoriteState;
  recently: RecentlyState;
};

export default rootReducer;
