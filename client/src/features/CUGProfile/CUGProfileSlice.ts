import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { ICUGProfile } from "../../models/CUGProfile";

export interface CUGProfileState {
  cugProfile: ICUGProfile | null;
  cugProfileList: ICUGProfile[];

  status: string;
}

const initialState: CUGProfileState = {
  cugProfile: null,
  status: "idle",
  cugProfileList: [],
};

export const getCUGProfilesAsync = createAsyncThunk<ICUGProfile[]>(
  "cugProfile/getCUGProfiles",
  async (thunkAPI: any) => {
    try {
      const CUGProfileList = await agent.CUGProfile.getAll();

      return CUGProfileList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCUGProfileNewAsync = createAsyncThunk<ICUGProfile>(
  "cugProfile/getCUGProfileNew",
  async (thunkAPI: any) => {
    try {
      const CUGProfile = await agent.CUGProfile.new();

      return CUGProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getNewCUGAndBaseProfile = createAsyncThunk<
  ICUGProfile,
  { baseProfileId: string }
>(
  "cugProfile/getCUGAndBaseProfileNew",
  async ({ baseProfileId }, thunkAPI: any) => {
    try {
      const CUGProfile = await agent.CUGProfile.getByBPID(baseProfileId);

      return CUGProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCUGProfileByIdAsync = createAsyncThunk<
  ICUGProfile,
  { id: string }
>("cugProfile/getCUGProfileById", async ({ id }, thunkAPI: any) => {
  try {
    const CUGProfile = await agent.CUGProfile.getById(id);

    return CUGProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createCUGProfileAsync = createAsyncThunk<ICUGProfile, FieldValues>(
  "cugProfile/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const CUGProfile = await agent.CUGProfile.create(data);

      return CUGProfile;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyCUGProfileAsync = createAsyncThunk<
  ICUGProfile,
  { id: string; values: any }
>("cugProfile/modifyCUGProfileById", async ({ id, values }, thunkAPI: any) => {
  try {
    const CUGProfile = await agent.CUGProfile.modify(id, values);

    return CUGProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteCUGProfileAsync = createAsyncThunk<
  ICUGProfile,
  { id: string }
>("cugProfile/deleteCUGProfile", async ({ id }, thunkAPI: any) => {
  try {
    const CUGProfile = await agent.CUGProfile.delete(id);

    return CUGProfile;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const CUGProfileSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.cugProfile = action.payload;
    },
    clearCategory: (state) => {
      state.cugProfile = null;
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createCUGProfileAsync.pending,
      (state: CUGProfileState, action: any) => {
        console.log(action);
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyCUGProfileAsync.pending,
      (state: CUGProfileState, action: any) => {
        console.log(action);
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteCUGProfileAsync.fulfilled,
      (state: CUGProfileState, action: any) => {
        const { id } = action.meta.arg;
        state.cugProfile = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteCUGProfileAsync.rejected,
      (state: CUGProfileState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCUGProfileAsync.fulfilled,
        getCUGProfileByIdAsync.fulfilled,
        getCUGProfileNewAsync.fulfilled,
        getNewCUGAndBaseProfile.fulfilled
      ),
      (state: CUGProfileState, action: any) => {
        state.cugProfile = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCUGProfileAsync.rejected,
        getCUGProfileByIdAsync.rejected,
        getCUGProfileNewAsync.rejected
      ),
      (state: CUGProfileState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(getCUGProfilesAsync.fulfilled),
      (state: CUGProfileState, action: any) => {
        state.cugProfileList = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getCUGProfilesAsync.rejected),
      (state: CUGProfileState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});
