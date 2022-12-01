import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";

import agent from "../../api/agent";

import { IFinalPermissions } from "../../models/FinalPermissions";

export interface FinalPermissionsState {
  finalPermissions: IFinalPermissions | null;

  status: string;
}

const initialState: FinalPermissionsState = {
  finalPermissions: null,
  status: "idle",
};

export const getFinalPermissionsAsync = createAsyncThunk<
  IFinalPermissions,
  { clientFundId: string; userId: string }
>(
  "finalPermissions/getfinalPermissions",
  async ({ clientFundId, userId }, thunkAPI: any) => {
    try {
      console.log("endpoint reached");

      const finalPermissions: any = await agent.FinalPermissions.getById(
        clientFundId,
        userId
      );
      console.log("endpoint reached", finalPermissions);
      return finalPermissions;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const finalPermissionsSlice = createSlice({
  name: "finalPermissions",
  initialState,
  reducers: {
    setFinalPermissions: (state, action) => {
      state.finalPermissions = action.payload;
    },
    clearFinalPermissions: (state) => {
      state.finalPermissions = null;
    },
  },

  extraReducers: (builder: any) => {
    builder.addMatcher(
      isAnyOf(getFinalPermissionsAsync.fulfilled),
      (state: FinalPermissionsState, action: any) => {
        console.log("end Reached");
        state.finalPermissions = action.payload;
        state.status = "idle";

        console.log("finalPermissions", state.finalPermissions);
      }
    );
    builder.addMatcher(
      isAnyOf(getFinalPermissionsAsync.rejected),
      (state: FinalPermissionsState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});

export const { clearFinalPermissions } = finalPermissionsSlice.actions;
