import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";

import { ISelectModel } from "../../models/Select";
import { ICFUProfile } from "../../models/CFUProfile";

export interface CFUProfileState {
  cfuProfile: ICFUProfile | null;
  cfuProfileList: ICFUProfile[];
  cfuProfileNameList: ISelectModel[];

  status: string;
}

const initialState: CFUProfileState = {
  cfuProfile: null,
  status: "idle",
  cfuProfileList: [],
  cfuProfileNameList: [],
};

export const getCFUProfilesAsync = createAsyncThunk<ICFUProfile[]>(
  "cfuProfile/getCFUProfiles",
  async (thunkAPI: any) => {
    try {
      const cfuProfileList = await agent.CFUProfile.getAll();

      return cfuProfileList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCFUProfileNewAsync = createAsyncThunk<ICFUProfile>(
  "cfuProfile/getCFUProfileNew",
  async (thunkAPI: any) => {
    try {
      const cfuProfile = await agent.CFUProfile.new();

      return cfuProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getNewCFUAndOtherProfilesAsync = createAsyncThunk<
  ICFUProfile,
  { userGroupId: string; clientFundId: string }
>(
  "cfuProfile/getCFUProfileNew",
  async ({ clientFundId, userGroupId }, thunkAPI: any) => {
    try {
      const cfuProfile = await agent.CFUProfile.getOtherProfiles(
        clientFundId,
        userGroupId
      );

      return cfuProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCFUProfileByIdAsync = createAsyncThunk<
  ICFUProfile,
  { id: string }
>("cfuProfile/getCFUProfileById", async ({ id }, thunkAPI: any) => {
  try {
    const cfuProfile = await agent.CFUProfile.getById(id);

    return cfuProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createCFUProfileAsync = createAsyncThunk<ICFUProfile, FieldValues>(
  "cfuProfile/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const cfuProfile = await agent.CFUProfile.create(data);

      return cfuProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyCFUProfileAsync = createAsyncThunk<
  ICFUProfile,
  { id: string; values: any }
>("cfuProfile/modifyCFUProfileById", async ({ id, values }, thunkAPI: any) => {
  try {
    const cfuProfile = await agent.CFUProfile.modify(id, values);

    return cfuProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteCFUProfileAsync = createAsyncThunk<
  ICFUProfile,
  { id: string }
>("cfuProfile/deleteCFUProfile", async ({ id }, thunkAPI: any) => {
  try {
    const cfuProfile = await agent.CFUProfile.delete(id);

    return cfuProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const cfuProfileSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCFUProfile: (state, action) => {
      state.cfuProfile = action.payload;
    },
    clearCFUProfile: (state) => {
      state.cfuProfile = null;
    },
    setBPNameIdList: (state, action) => {
      if (action.payload) {
        state.cfuProfileNameList = [];
        action.payload.map((x: any) => {
          state.cfuProfileNameList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearFundNameIdList: (state) => {
      state.cfuProfileNameList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createCFUProfileAsync.pending,
      (state: CFUProfileState, action: any) => {
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyCFUProfileAsync.pending,
      (state: CFUProfileState, action: any) => {
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteCFUProfileAsync.fulfilled,
      (state: CFUProfileState, action: any) => {
        const { id } = action.meta.arg;
        state.cfuProfile = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteCFUProfileAsync.rejected,
      (state: CFUProfileState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCFUProfileAsync.fulfilled,
        getCFUProfileByIdAsync.fulfilled,
        getCFUProfileNewAsync.fulfilled
      ),
      (state: CFUProfileState, action: any) => {
        state.cfuProfile = action.payload;
        state.status = "idle";

        //
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCFUProfileAsync.rejected,
        getCFUProfileByIdAsync.rejected,
        getCFUProfileNewAsync.rejected
      ),
      (state: CFUProfileState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getCFUProfilesAsync.fulfilled),
      (state: CFUProfileState, action: any) => {
        state.cfuProfileList = action.payload;
        state.status = "idle";
        if (action.payload) {
          state.cfuProfileNameList = [];
          action.payload.map((x: any) => {
            state.cfuProfileNameList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getCFUProfilesAsync.rejected),
      (state: CFUProfileState, action: any) => {
        state.status = "idle";
      }
    );
  },
});

export const { setCFUProfile, clearCFUProfile } = cfuProfileSlice.actions;
