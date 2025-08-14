import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  pin?: string;
}

export const initialState: UserState = {
  pin: undefined,
};

const { actions, reducer } = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserPin: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        pin: action.payload,
      };
    },
  },
});
export const { setUserPin } = actions;

export default reducer;
