import { TvShowDetail } from "@/constants/Types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { xorBy } from "lodash";

export interface FavoriteState {
  favoriteShows?: Pick<TvShowDetail, "id" | "image">[];
  favoriteEpisodes?: Pick<TvShowDetail, "id" | "image">[];
}

export const initialState: FavoriteState = {
  favoriteShows: undefined,
  favoriteEpisodes: undefined,
};

const { actions, reducer } = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavoriteShow: (
      state,
      action: PayloadAction<Pick<TvShowDetail, "id" | "image">>
    ) => {
      return {
        ...state,
        favoriteShows: xorBy(
          state.favoriteShows ?? [],
          [{ ...action.payload }],
          "id"
        ),
      };
    },
    toggleFavoriteEpisode: (
      state,
      action: PayloadAction<Pick<TvShowDetail, "id" | "image">>
    ) => {
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
