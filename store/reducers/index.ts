import { combineReducers } from "@reduxjs/toolkit";
import UserReducer, { UserState } from "./user";
import FavoritesReducer, { FavoriteState } from "./favorites";

const rootReducer = combineReducers({
  user: UserReducer,
  favorites: FavoritesReducer,
});

export type RootState = { user: UserState; favorites: FavoriteState };

export default rootReducer;
