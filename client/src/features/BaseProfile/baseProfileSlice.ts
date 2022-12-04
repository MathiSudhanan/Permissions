import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { IBaseProfile } from "../../models/BaseProfile";
import { ISelectModel } from "../../models/Select";

export interface BaseProfileState {
  baseProfile: IBaseProfile | null;
  baseProfileList: IBaseProfile[];
  baseProfileNameList: ISelectModel[];

  status: string;
}

const initialState: BaseProfileState = {
  baseProfile: null,
  status: "idle",
  baseProfileList: [],
  baseProfileNameList: [],
};

export const getBaseProfilesAsync = createAsyncThunk<IBaseProfile[]>(
  "baseProfile/getBaseProfiles",
  async (thunkAPI: any) => {
    try {
      const baseProfileList = await agent.BaseProfile.getAll();

      return baseProfileList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getBaseProfileNewAsync = createAsyncThunk<IBaseProfile>(
  "baseProfile/getBaseProfileNew",
  async (thunkAPI: any) => {
    try {
      const baseProfile = await agent.BaseProfile.new();

      return baseProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getBaseProfileByIdAsync = createAsyncThunk<
  IBaseProfile,
  { id: string }
>("baseProfile/getBaseProfileById", async ({ id }, thunkAPI: any) => {
  try {
    const baseProfile = await agent.BaseProfile.getById(id);

    return baseProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createBaseProfileAsync = createAsyncThunk<
  IBaseProfile,
  FieldValues
>("baseProfile/create", async (data: FieldValues, thunkAPI: any) => {
  try {
    const baseProfile = await agent.BaseProfile.create(data);

    return baseProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const modifyBaseProfileAsync = createAsyncThunk<
  IBaseProfile,
  { id: string; values: any }
>(
  "baseProfile/modifyBaseProfileById",
  async ({ id, values }, thunkAPI: any) => {
    try {
      const baseProfile = await agent.BaseProfile.modify(id, values);

      return baseProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const deleteBaseProfileAsync = createAsyncThunk<
  IBaseProfile,
  { id: string }
>("baseProfile/deleteBaseProfile", async ({ id }, thunkAPI: any) => {
  try {
    const baseProfile = await agent.BaseProfile.delete(id);

    return baseProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const baseProfileSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setBaseProfile: (state, action) => {
      state.baseProfile = action.payload;
    },
    clearBaseProfile: (state) => {
      state.baseProfile = null;
    },
    setBPNameIdList: (state, action) => {
      if (action.payload) {
        state.baseProfileNameList = [];
        action.payload.map((x: any) => {
          state.baseProfileNameList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearFundNameIdList: (state) => {
      state.baseProfileNameList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createBaseProfileAsync.pending,
      (state: BaseProfileState, action: any) => {
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyBaseProfileAsync.pending,
      (state: BaseProfileState, action: any) => {
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteBaseProfileAsync.fulfilled,
      (state: BaseProfileState, action: any) => {
        const { id } = action.meta.arg;
        state.baseProfile = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteBaseProfileAsync.rejected,
      (state: BaseProfileState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(
        createBaseProfileAsync.fulfilled,
        getBaseProfileByIdAsync.fulfilled,
        getBaseProfileNewAsync.fulfilled
      ),
      (state: BaseProfileState, action: any) => {
        state.baseProfile = action.payload;
        state.status = "idle";

        //
      }
    );
    builder.addMatcher(
      isAnyOf(
        createBaseProfileAsync.rejected,
        getBaseProfileByIdAsync.rejected,
        getBaseProfileNewAsync.rejected
      ),
      (state: BaseProfileState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getBaseProfilesAsync.fulfilled),
      (state: BaseProfileState, action: any) => {
        state.baseProfileList = action.payload;
        state.status = "idle";
        if (action.payload) {
          state.baseProfileNameList = [];
          action.payload.map((x: any) => {
            state.baseProfileNameList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getBaseProfilesAsync.rejected),
      (state: BaseProfileState, action: any) => {
        state.status = "idle";
      }
    );
  },
});

export const { setBaseProfile, clearBaseProfile } = baseProfileSlice.actions;
