import { TvImageObj } from "@/constants/Types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { xorBy } from "lodash";

export type FavoriteObj = {
  id: number;
  image: TvImageObj;
  name: string;
};

export interface FavoriteState {
  favoriteShows?: FavoriteObj[];
  favoriteEpisodes?: FavoriteObj[];
}

export const favoritesInitialState: FavoriteState = {
  favoriteShows: undefined,
  favoriteEpisodes: undefined,
};

const { actions, reducer } = createSlice({
  name: "favorites",
  initialState: favoritesInitialState,
  reducers: {
    toggleFavoriteShow: (state, action: PayloadAction<FavoriteObj>) => {
      return {
        ...state,
        favoriteShows: xorBy(
          state.favoriteShows ?? [],
          [{ ...action.payload }],
          "id"
        ),
      };
    },
    toggleFavoriteEpisode: (state, action: PayloadAction<FavoriteObj>) => {
      return {
        ...state,
        favoriteEpisodes: xorBy(
          state.favoriteEpisodes,
          [{ ...action.payload }],
          {
            id: action.payload.id,
          }
        ),
      };
    },
  },
});
export const { toggleFavoriteShow, toggleFavoriteEpisode } = actions;

export default reducer;
