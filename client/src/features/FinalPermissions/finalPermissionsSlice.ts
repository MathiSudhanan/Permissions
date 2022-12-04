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
      const finalPermissions: any = await agent.FinalPermissions.getById(
        clientFundId,
        userId
      );

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
        state.finalPermissions = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getFinalPermissionsAsync.rejected),
      (state: FinalPermissionsState, action: any) => {
        state.status = "idle";
        state.finalPermissions = null;
      }
    );
  },
});

export const { clearFinalPermissions } = finalPermissionsSlice.actions;
