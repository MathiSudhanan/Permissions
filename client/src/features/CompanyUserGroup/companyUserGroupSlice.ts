import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { ICompanyUserGroup } from "../../models/CompanyUserGroup";
import { ISelectModel } from "../../models/Select";

export interface CompanyUserGroupState {
  companyUserGroup: ICompanyUserGroup | null;
  companyUserGroupList: ICompanyUserGroup[];
  companyUserGroupNamesList: ISelectModel[];
  status: string;
}

const initialState: CompanyUserGroupState = {
  companyUserGroup: null,
  status: "idle",
  companyUserGroupList: [],
  companyUserGroupNamesList: [],
};

export const getCompanyUserGroupAsync = createAsyncThunk<ICompanyUserGroup[]>(
  "companyUserGroup/getCompanyUserGroups",
  async (thunkAPI: any) => {
    try {
      const companyUserGroupList = await agent.CompanyUserGroup.getAll();

      return companyUserGroupList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCompanyUserGroupByIdAsync = createAsyncThunk<
  ICompanyUserGroup,
  { id: string }
>("companyUserGroup/getCompanyUserGroupById", async ({ id }, thunkAPI: any) => {
  try {
    const companyUserGroup = await agent.Company.getById(id);

    return companyUserGroup;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createCompanyUserGroupAsync = createAsyncThunk<
  ICompanyUserGroup,
  FieldValues
>("companyUserGroup/create", async (data: FieldValues, thunkAPI: any) => {
  try {
    const companyUserGroup = await agent.CompanyUserGroup.create(data);

    return companyUserGroup;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const modifyCompanyUserGroupAsync = createAsyncThunk<
  ICompanyUserGroup,
  { id: string; values: any }
>(
  "companyUserGroup/modifyCompanyUserGroup",
  async ({ id, values }, thunkAPI: any) => {
    try {
      const companyUserGroup = await agent.CompanyUserGroup.modify(id, values);

      return companyUserGroup;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const deleteCompanyUserGroupAsync = createAsyncThunk<
  ICompanyUserGroup,
  { id: string }
>("companyUserGroup/deleteCompanyUserGroup", async ({ id }, thunkAPI: any) => {
  try {
    const companyUserGroup = await agent.CompanyUserGroup.delete(id);

    return companyUserGroup;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const companyUserGroupSlice = createSlice({
  name: "companyUserGroup",
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.companyUserGroup = action.payload;
    },
    clearCompany: (state) => {
      state.companyUserGroup = null;
    },
    setCompanyList: (state, action) => {
      state.companyUserGroupList = action.payload;
    },
    clearCompanyList: (state) => {
      state.companyUserGroupList = [];
    },
    setCompanyNameIdList: (state, action) => {
      if (action.payload) {
        state.companyUserGroupList = [];
        action.payload.forEach((x: any) => {
          state.companyUserGroupNamesList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearCompanyNameIdList: (state) => {
      state.companyUserGroupList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createCompanyUserGroupAsync.pending,
      (state: CompanyUserGroupState, action: any) => {
        console.log(action);
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyCompanyUserGroupAsync.pending,
      (state: CompanyUserGroupState, action: any) => {
        console.log(action);
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteCompanyUserGroupAsync.fulfilled,
      (state: CompanyUserGroupState, action: any) => {
        state.companyUserGroup = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteCompanyUserGroupAsync.rejected,
      (state: CompanyUserGroupState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCompanyUserGroupAsync.fulfilled,
        getCompanyUserGroupByIdAsync.fulfilled
      ),
      (state: CompanyUserGroupState, action: any) => {
        state.companyUserGroup = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(
        createCompanyUserGroupAsync.rejected,
        getCompanyUserGroupByIdAsync.rejected
      ),
      (state: CompanyUserGroupState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(getCompanyUserGroupAsync.fulfilled),
      (state: CompanyUserGroupState, action: any) => {
        state.companyUserGroupList = action.payload;

        state.status = "idle";
        if (action.payload) {
          state.companyUserGroupNamesList = [];
          action.payload.forEach((x: any) => {
            state.companyUserGroupNamesList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getCompanyUserGroupAsync.rejected),
      (state: CompanyUserGroupState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});

export const { setCompany, clearCompany, setCompanyList, clearCompanyList } =
  companyUserGroupSlice.actions;
