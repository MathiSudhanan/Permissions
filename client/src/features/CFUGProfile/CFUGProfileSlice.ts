import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";

import { ISelectModel } from "../../models/Select";
import { ICFUGProfile } from "../../models/CFUGProfile";

export interface CFUGProfileState {
  cfugProfile: ICFUGProfile | null;
  cfugProfileList: ICFUGProfile[];
  cfugProfileNameList: ISelectModel[];

  status: string;
}

const initialState: CFUGProfileState = {
  cfugProfile: null,
  status: "idle",
  cfugProfileList: [],
  cfugProfileNameList: [],
};

export const getCFUGProfilesAsync = createAsyncThunk<ICFUGProfile[]>(
  "cfugProfile/getCFUGProfiles",
  async (thunkAPI: any) => {
    try {
      const cfugProfileList = await agent.CFUGProfile.getAll();

      return cfugProfileList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCFUGProfileNewAsync = createAsyncThunk<ICFUGProfile>(
  "cfugProfile/getCFUGProfileNew",
  async (thunkAPI: any) => {
    try {
      const cfugProfile = await agent.CFUGProfile.new();

      return cfugProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getNewCFUGAndOtherProfilesAsync = createAsyncThunk<
  ICFUGProfile,
  { userGroupId: string; clientFundId: string }
>(
  "cfugProfile/getCFUGProfileNew",
  async ({ clientFundId, userGroupId }, thunkAPI: any) => {
    try {
      const cfugProfile = await agent.CFUGProfile.getOtherProfiles(
        clientFundId,
        userGroupId
      );

      return cfugProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCFUGProfileByIdAsync = createAsyncThunk<
  ICFUGProfile,
  { id: string }
>("cfugProfile/getCFUGProfileById", async ({ id }, thunkAPI: any) => {
  try {
    const cfugProfile = await agent.CFUGProfile.getById(id);

    return cfugProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createCFUGProfileAsync = createAsyncThunk<
  ICFUGProfile,
  FieldValues
>("cfugProfile/create", async (data: FieldValues, thunkAPI: any) => {
  try {
    const cfugProfile = await agent.CFUGProfile.create(data);

    return cfugProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const modifyCFUGProfileAsync = createAsyncThunk<
  ICFUGProfile,
  { id: string; values: any }
>(
  "cfugProfile/modifyCFUGProfileById",
  async ({ id, values }, thunkAPI: any) => {
    try {
      const cfugProfile = await agent.CFUGProfile.modify(id, values);

      return cfugProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const deleteCFUGProfileAsync = createAsyncThunk<
  ICFUGProfile,
  { id: string }
>("cfugProfile/deleteCFUGProfile", async ({ id }, thunkAPI: any) => {
  try {
    const cfugProfile = await agent.CFUGProfile.delete(id);

    return cfugProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const cfugProfileSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCFUGProfile: (state, action) => {
      state.cfugProfile = action.payload;
    },
    clearCFUGProfile: (state) => {
      state.cfugProfile = null;
    },
    setBPNameIdList: (state, action) => {
      if (action.payload) {
        state.cfugProfileNameList = [];
        action.payload.map((x: any) => {
          state.cfugProfileNameList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearFundNameIdList: (state) => {
      state.cfugProfileNameList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createCFUGProfileAsync.pending,
      (state: CFUGProfileState, action: any) => {
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyCFUGProfileAsync.pending,
      (state: CFUGProfileState, action: any) => {
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteCFUGProfileAsync.fulfilled,
      (state: CFUGProfileState, action: any) => {
        const { id } = action.meta.arg;
        state.cfugProfile = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteCFUGProfileAsync.rejected,
      (state: CFUGProfileState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCFUGProfileAsync.fulfilled,
        getCFUGProfileByIdAsync.fulfilled,
        getCFUGProfileNewAsync.fulfilled
      ),
      (state: CFUGProfileState, action: any) => {
        state.cfugProfile = action.payload;
        state.status = "idle";

        //
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCFUGProfileAsync.rejected,
        getCFUGProfileByIdAsync.rejected,
        getCFUGProfileNewAsync.rejected
      ),
      (state: CFUGProfileState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getCFUGProfilesAsync.fulfilled),
      (state: CFUGProfileState, action: any) => {
        state.cfugProfileList = action.payload;
        state.status = "idle";
        if (action.payload) {
          state.cfugProfileNameList = [];
          action.payload.map((x: any) => {
            state.cfugProfileNameList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getCFUGProfilesAsync.rejected),
      (state: CFUGProfileState, action: any) => {
        state.status = "idle";
      }
    );
  },
});

export const { setCFUGProfile, clearCFUGProfile } = cfugProfileSlice.actions;
