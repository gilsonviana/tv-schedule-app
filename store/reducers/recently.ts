import { TvImageObj } from "@/constants/Types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { findIndex, size } from "lodash";

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

      // Doc: Limits the number of recently viewd items to avoid running out of memory.
      if (size(state[action.payload.type]) >= 10) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        [action.payload.type]: !alreadyAdded
          ? [...(state[action.payload.type] || []), { ...action.payload }]
          : state[action.payload.type],
      };
    },
  },
});
export const { addRecently } = actions;

export default reducer;
