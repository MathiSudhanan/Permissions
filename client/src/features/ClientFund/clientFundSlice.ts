import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { IClientFund } from "../../models/ClientFund";

export interface ClientFundState {
  clientFund: IClientFund | null;
  clientFundList: IClientFund[];

  status: string;
}

const initialState: ClientFundState = {
  clientFund: null,
  status: "idle",
  clientFundList: [],
};

export const getClientFundsAsync = createAsyncThunk<IClientFund[]>(
  "clientFund/getClientFunds",
  async (thunkAPI: any) => {
    try {
      const clientFundList = await agent.ClientFund.getAll();

      return clientFundList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getClientFundByIdAsync = createAsyncThunk<
  IClientFund,
  { id: string }
>("clientFund/getClientFundById", async ({ id }, thunkAPI: any) => {
  try {
    const clientFund = await agent.ClientFund.getById(id);

    return clientFund;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createClientFundAsync = createAsyncThunk<IClientFund, FieldValues>(
  "clientFund/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const clientFund = await agent.ClientFund.create(data);

      return clientFund;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyClientFundAsync = createAsyncThunk<
  IClientFund,
  { id: string; values: any }
>("clientFund/getClientFundById", async ({ id, values }, thunkAPI: any) => {
  try {
    const clientFund = await agent.ClientFund.modify(id, values);

    return clientFund;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteClientFundAsync = createAsyncThunk<
  IClientFund,
  { id: string }
>("clientFund/deleteClientFund", async ({ id }, thunkAPI: any) => {
  try {
    const clientFund = await agent.ClientFund.delete(id);

    return clientFund;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const clientFundSlice = createSlice({
  name: "clientFund",
  initialState,
  reducers: {
    setClientFund: (state, action) => {
      state.clientFund = action.payload;
    },
    clearClientFund: (state) => {
      state.clientFund = null;
    },
    setClientFundList: (state, action) => {
      state.clientFundList = action.payload;
    },
    clearClientFundList: (state) => {
      state.clientFundList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createClientFundAsync.pending,
      (state: ClientFundState, action: any) => {
        console.log(action);
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyClientFundAsync.pending,
      (state: ClientFundState, action: any) => {
        console.log(action);
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteClientFundAsync.fulfilled,
      (state: ClientFundState, action: any) => {
        const { id } = action.meta.arg;
        state.clientFund = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteClientFundAsync.rejected,
      (state: ClientFundState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(
        createClientFundAsync.fulfilled,
        getClientFundByIdAsync.fulfilled
      ),
      (state: ClientFundState, action: any) => {
        state.clientFund = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createClientFundAsync.rejected, getClientFundByIdAsync.rejected),
      (state: ClientFundState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(getClientFundsAsync.fulfilled),
      (state: ClientFundState, action: any) => {
        state.clientFundList = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getClientFundsAsync.rejected),
      (state: ClientFundState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});

export const {
  setClientFund,
  clearClientFund,
  setClientFundList,
  clearClientFundList,
} = clientFundSlice.actions;
