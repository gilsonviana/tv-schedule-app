import { combineReducers } from "@reduxjs/toolkit";
import UserReducer, { UserState } from "./user";
import FavoritesReducer, { FavoriteState } from "./favorites";
import RecentlyReducer, { RecentlyState } from "./recently";

const rootReducer = combineReducers({
  user: UserReducer,
  favorites: FavoritesReducer,
  recently: RecentlyReducer,
});

export type RootState = {
  user: UserState;
  favorites: FavoriteState;
  recently: RecentlyState;
};

export default rootReducer;
