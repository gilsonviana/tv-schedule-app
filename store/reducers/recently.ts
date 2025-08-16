import { TvImageObj } from "@/constants/Types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { findIndex } from "lodash";

type RecentlyObj = {
  id: number;
  image: TvImageObj;
  name: string;
};

export interface RecentlyState {
  shows?: RecentlyObj[];
  episodes?: RecentlyObj[];
  people?: RecentlyObj[];
}

export const recentlyInitialState: RecentlyState = {
  shows: undefined,
  episodes: undefined,
  people: undefined,
};

const { actions, reducer } = createSlice({
  name: "recently",
  initialState: recentlyInitialState,
  reducers: {
    addRecently: (
      state,
      action: PayloadAction<
        { type: "shows" | "episodes" | "people" } & RecentlyObj
      >
    ) => {
      const alreadyAdded =
        findIndex(state[action.payload.type], {
          id: action.payload.id,
        }) >= 0;
      return {
        ...state,
        [action.payload.type]: !alreadyAdded
          ? [...(state[action.payload.type] || []), { ...action.payload }]
          : state[action.payload.type],
      };
    },
    clearRecently: (
      state,
      action: PayloadAction<{ type: "shows" | "episodes" | "people" }>
    ) => {
      return {
        ...state,
        [action.payload.type]: undefined,
      };
    },
  },
});
export const { addRecently, clearRecently } = actions;

export default reducer;
