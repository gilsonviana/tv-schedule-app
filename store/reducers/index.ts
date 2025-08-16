import { combineReducers } from "@reduxjs/toolkit";
import FavoritesReducer, {
  favoritesInitialState,
  FavoriteState,
} from "./favorites";
import RecentlyReducer, {
  recentlyInitialState,
  RecentlyState,
} from "./recently";

const appReducer = combineReducers({
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

  if (action.type === "RESET") {
    return {
      favorites: favoritesInitialState,
      recently: recentlyInitialState,
    };
  }

  return appReducer(state, action);
};

export type RootState = {
  favorites: FavoriteState;
  recently: RecentlyState;
};

export default rootReducer;
