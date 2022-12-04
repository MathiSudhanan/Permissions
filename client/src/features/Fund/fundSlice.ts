import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { IFund } from "../../models/Fund";
import { ISelectModel } from "../../models/Select";

export interface FundState {
  fund: IFund | null;
  fundList: IFund[];
  fundNamesList: ISelectModel[];

  status: string;
}

const initialState: FundState = {
  fund: null,
  status: "idle",
  fundList: [],
  fundNamesList: [],
};

export const getFundsAsync = createAsyncThunk<IFund[]>(
  "fund/getFunds",
  async (thunkAPI: any) => {
    try {
      const fundList = await agent.Fund.getAll();

      return fundList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getFundByIdAsync = createAsyncThunk<IFund, { id: string }>(
  "fund/getFundById",
  async ({ id }, thunkAPI: any) => {
    try {
      const fund = await agent.Fund.getById(id);

      return fund;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const createFundAsync = createAsyncThunk<IFund, FieldValues>(
  "fund/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const fund = await agent.Fund.create(data);

      return fund;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyFundAsync = createAsyncThunk<
  IFund,
  { id: string; values: any }
>("Fund/getFundById", async ({ id, values }, thunkAPI: any) => {
  try {
    const fund = await agent.Fund.modify(id, values);

    return fund;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteFundAsync = createAsyncThunk<IFund, { id: string }>(
  "fund/deleteFund",
  async ({ id }, thunkAPI: any) => {
    try {
      const fund = await agent.Fund.delete(id);

      return fund;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const fundSlice = createSlice({
  name: "Fund",
  initialState,
  reducers: {
    setFund: (state, action) => {
      state.fund = action.payload;
    },
    clearFund: (state) => {
      state.fund = null;
    },
    setFundList: (state, action) => {
      state.fundList = action.payload;
    },
    clearFundList: (state) => {
      state.fundList = [];
    },
    setFundNameIdList: (state, action) => {
      if (action.payload) {
        state.fundNamesList = [];
        action.payload.map((x: any) => {
          state.fundNamesList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearFundNameIdList: (state) => {
      state.fundNamesList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createFundAsync.pending,
      (state: FundState, action: any) => {
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyFundAsync.pending,
      (state: FundState, action: any) => {
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteFundAsync.fulfilled,
      (state: FundState, action: any) => {
        const { id } = action.meta.arg;
        state.fund = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteFundAsync.rejected,
      (state: FundState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createFundAsync.fulfilled, getFundByIdAsync.fulfilled),
      (state: FundState, action: any) => {
        state.fund = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createFundAsync.rejected, getFundByIdAsync.rejected),
      (state: FundState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getFundsAsync.fulfilled),
      (state: FundState, action: any) => {
        state.fundList = action.payload;
        state.status = "idle";
        if (action.payload) {
          state.fundNamesList = [];
          action.payload.map((x: any) => {
            state.fundNamesList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getFundsAsync.rejected),
      (state: FundState, action: any) => {
        state.status = "idle";
      }
    );
  },
});

export const { setFund, clearFund, setFundList, clearFundList } =
  fundSlice.actions;
