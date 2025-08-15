import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  requestBiometric?: boolean;
}

export const initialState: UserState = {
  requestBiometric: true,
};

const { actions, reducer } = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleRequestBiometric: (state) => {
      return {
        ...state,
        requestBiometric: !state.requestBiometric
      };
    },
  },
});
export const { toggleRequestBiometric } = actions;

export default reducer;
