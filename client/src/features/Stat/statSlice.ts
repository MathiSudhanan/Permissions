import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { IStat } from "../../models/Stat";

export interface StatState {
  stat: IStat | null;
  statList: IStat[];

  status: string;
}

const initialState: StatState = {
  stat: null,
  status: "idle",
  statList: [],
};

export const getStatsAsync = createAsyncThunk<IStat[]>(
  "stat/getStats",
  async (thunkAPI: any) => {
    try {
      const statList = await agent.Stat.getAll();

      return statList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getStatByIdAsync = createAsyncThunk<IStat, { id: string }>(
  "stat/getStatById",
  async ({ id }, thunkAPI: any) => {
    try {
      const statList = await agent.Stat.getById(id);

      return statList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const createStatAsync = createAsyncThunk<IStat, FieldValues>(
  "stat/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const stat = await agent.Stat.create(data);

      return stat;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyStatAsync = createAsyncThunk<
  IStat,
  { id: string; values: any }
>("stat/getStatById", async ({ id, values }, thunkAPI: any) => {
  try {
    const stat = await agent.Stat.modify(id, values);

    return stat;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteStatAsync = createAsyncThunk<IStat, { id: string }>(
  "stat/deleteStat",
  async ({ id }, thunkAPI: any) => {
    try {
      const stat = await agent.Stat.delete(id);

      return stat;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {
    setStat: (state, action) => {
      state.stat = action.payload;
    },
    clearStat: (state) => {
      state.stat = null;
    },
    setStatList: (state, action) => {
      state.statList = action.payload;
    },
    clearStatList: (state) => {
      state.statList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createStatAsync.pending,
      (state: StatState, action: any) => {
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyStatAsync.pending,
      (state: StatState, action: any) => {
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteStatAsync.fulfilled,
      (state: StatState, action: any) => {
        const { id } = action.meta.arg;
        state.stat = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteStatAsync.rejected,
      (state: StatState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createStatAsync.fulfilled, getStatByIdAsync.fulfilled),
      (state: StatState, action: any) => {
        state.stat = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createStatAsync.rejected, getStatByIdAsync.rejected),
      (state: StatState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getStatsAsync.fulfilled),
      (state: StatState, action: any) => {
        state.statList = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getStatsAsync.rejected),
      (state: StatState, action: any) => {
        state.status = "idle";
      }
    );
  },
});

export const { setStat, clearStat, setStatList, clearStatList } =
  statSlice.actions;
