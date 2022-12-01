import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { ISelectModel } from "../../models/Select";
import { IUserGroupMapping } from "../../models/UserGroupMapping";

export interface UserGroupMappingState {
  userGroupMapping: IUserGroupMapping | null;
  userGroupMappingList: IUserGroupMapping[];
  userNameList: ISelectModel[];
  status: string;
}

const initialState: UserGroupMappingState = {
  userGroupMapping: null,
  status: "idle",
  userGroupMappingList: [],
  userNameList: [],
};



export const getUserGroupMappingAsync = createAsyncThunk<IUserGroupMapping[]>(
  "userGroupMapping/getUserGroupMappings",
  async (thunkAPI: any) => {
    try {
      const userGroupMappingList = await agent.UserGroupMapping.getAll();

      return userGroupMappingList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getUserGroupMappingByIdAsync = createAsyncThunk<
  IUserGroupMapping,
  { id: string }
>("userGroupMapping/getUserGroupMappingById", async ({ id }, thunkAPI: any) => {
  try {
    const userGroupMapping = await agent.UserGroupMapping.getById(id);

    return userGroupMapping;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createUserGroupMappingAsync = createAsyncThunk<
  IUserGroupMapping,
  FieldValues
>("userGroupMapping/create", async (data: FieldValues, thunkAPI: any) => {
  try {
    const userGroupMapping = await agent.UserGroupMapping.create(data);

    return userGroupMapping;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const modifyUserGroupMappingAsync = createAsyncThunk<
  IUserGroupMapping,
  { id: string; values: any }
>(
  "userGroupMapping/getUserGroupMappingById",
  async ({ id, values }, thunkAPI: any) => {
    try {
      const userGroupMapping = await agent.UserGroupMapping.modify(id, values);

      return userGroupMapping;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const deleteUserGroupMappingAsync = createAsyncThunk<
  IUserGroupMapping,
  { id: string }
>("userGroupMapping/deleteUserGroupMapping", async ({ id }, thunkAPI: any) => {
  try {
    const userGroupMapping = await agent.UserGroupMapping.delete(id);

    return userGroupMapping;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const userGroupMappingSlice = createSlice({
  name: "userGroupMapping",
  initialState,
  reducers: {
    setUserGroupMapping: (state, action) => {
      state.userGroupMapping = action.payload;
    },
    clearUserGroupMapping: (state) => {
      state.userGroupMapping = null;
    },
    setUserGroupMappingList: (state, action) => {
      state.userGroupMappingList = action.payload;
      console.log(state.userGroupMappingList);
    },
    clearUserGroupMappingList: (state) => {
      state.userGroupMappingList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createUserGroupMappingAsync.pending,
      (state: UserGroupMappingState, action: any) => {
        console.log(action);
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyUserGroupMappingAsync.pending,
      (state: UserGroupMappingState, action: any) => {
        console.log(action);
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteUserGroupMappingAsync.fulfilled,
      (state: UserGroupMappingState, action: any) => {
        const { id } = action.meta.arg;
        state.userGroupMapping = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteUserGroupMappingAsync.rejected,
      (state: UserGroupMappingState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(
        createUserGroupMappingAsync.fulfilled,
        getUserGroupMappingByIdAsync.fulfilled
      ),
      (state: UserGroupMappingState, action: any) => {
        state.userGroupMapping = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(
        createUserGroupMappingAsync.rejected,
        getUserGroupMappingByIdAsync.rejected
      ),
      (state: UserGroupMappingState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    
    builder.addMatcher(
      isAnyOf(getUserGroupMappingAsync.fulfilled),
      (state: UserGroupMappingState, action: any) => {
        state.status = "idle";

        state.userGroupMappingList = action.payload;

        console.log(state.userGroupMappingList);
      }
    );
    builder.addMatcher(
      isAnyOf(getUserGroupMappingAsync.rejected),
      (state: UserGroupMappingState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});

export const {
  setUserGroupMapping,
  clearUserGroupMapping,
  setUserGroupMappingList,
  clearUserGroupMappingList,
} = userGroupMappingSlice.actions;
