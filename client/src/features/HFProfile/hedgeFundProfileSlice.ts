import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { IHedgeFundProfile } from "../../models/HFProfile";
import { ISelectModel } from "../../models/Select";

export interface HedgeFundProfileState {
  hedgeFundProfile: IHedgeFundProfile | null;
  hedgeFundProfileList: IHedgeFundProfile[];
  hedgeFundProfileNameList: ISelectModel[];

  status: string;
}

const initialState: HedgeFundProfileState = {
  hedgeFundProfile: null,
  status: "idle",
  hedgeFundProfileList: [],
  hedgeFundProfileNameList: [],
};

export const getHedgeFundProfilesAsync = createAsyncThunk<IHedgeFundProfile[]>(
  "hedgeFundProfile/getHedgeFundProfiles",
  async (thunkAPI: any) => {
    try {
      const hedgeFundProfileList = await agent.HFProfile.getAll();

      return hedgeFundProfileList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getHedgeFundProfileNewAsync = createAsyncThunk<IHedgeFundProfile>(
  "hedgeFundProfile/getHedgeFundProfileNew",
  async (thunkAPI: any) => {
    try {
      const hedgeFundProfile = await agent.HFProfile.new();

      return hedgeFundProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getHedgeFundProfileByIdAsync = createAsyncThunk<
  IHedgeFundProfile,
  { id: string }
>("hedgeFundProfile/getHedgeFundProfileById", async ({ id }, thunkAPI: any) => {
  try {
    const hedgeFundProfile = await agent.HFProfile.getById(id);

    return hedgeFundProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createHedgeFundProfileAsync = createAsyncThunk<
  IHedgeFundProfile,
  FieldValues
>("hedgeFundProfile/create", async (data: FieldValues, thunkAPI: any) => {
  try {
    const hedgeFundProfile = await agent.HFProfile.create(data);

    return hedgeFundProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const modifyHedgeFundProfileAsync = createAsyncThunk<
  IHedgeFundProfile,
  { id: string; values: any }
>(
  "hedgeFundProfile/modifyHedgeFundProfileById",
  async ({ id, values }, thunkAPI: any) => {
    try {
      const hedgeFundProfile = await agent.HFProfile.modify(id, values);

      return hedgeFundProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const deleteHedgeFundProfileAsync = createAsyncThunk<
  IHedgeFundProfile,
  { id: string }
>("hedgeFundProfile/deleteHedgeFundProfile", async ({ id }, thunkAPI: any) => {
  try {
    const hedgeFundProfile = await agent.HFProfile.delete(id);

    return hedgeFundProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const hedgeFundProfileSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.hedgeFundProfile = action.payload;
    },
    clearCategory: (state) => {
      state.hedgeFundProfile = null;
    },
    setBPNameIdList: (state, action) => {
      if (action.payload) {
        state.hedgeFundProfileNameList = [];
        action.payload.map((x: any) => {
          state.hedgeFundProfileNameList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearFundNameIdList: (state) => {
      state.hedgeFundProfileNameList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createHedgeFundProfileAsync.pending,
      (state: HedgeFundProfileState, action: any) => {
        console.log(action);
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyHedgeFundProfileAsync.pending,
      (state: HedgeFundProfileState, action: any) => {
        console.log(action);
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteHedgeFundProfileAsync.fulfilled,
      (state: HedgeFundProfileState, action: any) => {
        const { id } = action.meta.arg;
        state.hedgeFundProfile = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteHedgeFundProfileAsync.rejected,
      (state: HedgeFundProfileState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(
        createHedgeFundProfileAsync.fulfilled,
        getHedgeFundProfileByIdAsync.fulfilled,
        getHedgeFundProfileNewAsync.fulfilled
      ),
      (state: HedgeFundProfileState, action: any) => {
        state.hedgeFundProfile = action.payload;
        state.status = "idle";

        //
      }
    );
    builder.addMatcher(
      isAnyOf(
        createHedgeFundProfileAsync.rejected,
        getHedgeFundProfileByIdAsync.rejected,
        getHedgeFundProfileNewAsync.rejected
      ),
      (state: HedgeFundProfileState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(getHedgeFundProfilesAsync.fulfilled),
      (state: HedgeFundProfileState, action: any) => {
        state.hedgeFundProfileList = action.payload;
        state.status = "idle";
        if (action.payload) {
          state.hedgeFundProfileNameList = [];
          action.payload.map((x: any) => {
            state.hedgeFundProfileNameList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getHedgeFundProfilesAsync.rejected),
      (state: HedgeFundProfileState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});
