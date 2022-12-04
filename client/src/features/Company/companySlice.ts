import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { ICompany } from "../../models/Company";
import { ISelectModel } from "../../models/Select";

export interface CompanyState {
  company: ICompany | null;
  companyList: ICompany[];
  companyNamesList: ISelectModel[];
  status: string;
}

const initialState: CompanyState = {
  company: null,
  status: "idle",
  companyList: [],
  companyNamesList: [],
};

export const getCompanyAsync = createAsyncThunk<ICompany[]>(
  "company/getCompanies",
  async (thunkAPI: any) => {
    try {
      const companyList = await agent.Company.getAll();

      return companyList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCompanyByIdAsync = createAsyncThunk<ICompany, { id: string }>(
  "company/getCompanyById",
  async ({ id }, thunkAPI: any) => {
    try {
      const company = await agent.Company.getById(id);

      return company;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const createCompanyAsync = createAsyncThunk<ICompany, FieldValues>(
  "company/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const company = await agent.Company.create(data);

      return company;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyCompanyAsync = createAsyncThunk<
  ICompany,
  { id: string; values: any }
>("company/getCompanyById", async ({ id, values }, thunkAPI: any) => {
  try {
    const company = await agent.Company.modify(id, values);

    return company;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteCompanyAsync = createAsyncThunk<ICompany, { id: string }>(
  "company/deleteCompany",
  async ({ id }, thunkAPI: any) => {
    try {
      const company = await agent.Company.delete(id);

      return company;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    clearCompany: (state) => {
      state.company = null;
    },
    setCompanyList: (state, action) => {
      state.companyList = action.payload;
    },
    clearCompanyList: (state) => {
      state.companyList = [];
    },
    setCompanyNameIdList: (state, action) => {
      if (action.payload) {
        state.companyNamesList = [];
        action.payload.map((x: any) => {
          state.companyNamesList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearCompanyNameIdList: (state) => {
      state.companyNamesList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createCompanyAsync.pending,
      (state: CompanyState, action: any) => {
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyCompanyAsync.pending,
      (state: CompanyState, action: any) => {
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteCompanyAsync.fulfilled,
      (state: CompanyState, action: any) => {
        const { id } = action.meta.arg;
        state.company = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteCompanyAsync.rejected,
      (state: CompanyState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createCompanyAsync.fulfilled, getCompanyByIdAsync.fulfilled),
      (state: CompanyState, action: any) => {
        state.company = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createCompanyAsync.rejected, getCompanyByIdAsync.rejected),
      (state: CompanyState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getCompanyAsync.fulfilled),
      (state: CompanyState, action: any) => {
        state.companyList = action.payload;

        state.status = "idle";
        if (action.payload) {
          state.companyNamesList = [];
          action.payload.map((x: any) => {
            state.companyNamesList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getCompanyAsync.rejected),
      (state: CompanyState, action: any) => {
        state.status = "idle";
      }
    );
  },
});

export const { setCompany, clearCompany, setCompanyList, clearCompanyList } =
  companySlice.actions;
