import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { ISelectModel } from "../../models/Select";
import { IUserGroup } from "../../models/UserGroup";

export interface UserGroupState {
  userGroup: IUserGroup | null;
  userGroupList: IUserGroup[];
  userGroupNamesList: ISelectModel[];
  status: string;
}

const initialState: UserGroupState = {
  userGroup: null,
  status: "idle",
  userGroupList: [],
  userGroupNamesList: [],
};

export const getUserGroupAsync = createAsyncThunk<IUserGroup[]>(
  "userGroup/getUserGroups",
  async (thunkAPI: any) => {
    try {
      const userGroupList = await agent.UserGroup.getAll();

      return userGroupList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getUserGroupByIdAsync = createAsyncThunk<
  IUserGroup,
  { id: string }
>("userGroup/getUserGroupById", async ({ id }, thunkAPI: any) => {
  try {
    const userGroup = await agent.UserGroup.getById(id);

    return userGroup;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createUserGroupAsync = createAsyncThunk<IUserGroup, FieldValues>(
  "userGroup/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const userGroup = await agent.UserGroup.create(data);

      return userGroup;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyUserGroupAsync = createAsyncThunk<
  IUserGroup,
  { id: string; values: any }
>("userGroup/getUserGroupById", async ({ id, values }, thunkAPI: any) => {
  try {
    const userGroup = await agent.UserGroup.modify(id, values);

    return userGroup;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteUserGroupAsync = createAsyncThunk<
  IUserGroup,
  { id: string }
>("userGroup/deleteUserGroup", async ({ id }, thunkAPI: any) => {
  try {
    const userGroup = await agent.UserGroup.delete(id);

    return userGroup;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const userGroupSlice = createSlice({
  name: "userGroup",
  initialState,
  reducers: {
    setUserGroup: (state, action) => {
      state.userGroup = action.payload;
    },
    clearUserGroup: (state) => {
      state.userGroup = null;
    },
    setUserGroupList: (state, action) => {
      state.userGroupList = action.payload;
    },
    clearUserGroupList: (state) => {
      state.userGroupList = [];
    },
    setUserGroupNameIdList: (state, action) => {
      if (action.payload) {
        state.userGroupNamesList = [];
        action.payload.map((x: any) => {
          state.userGroupNamesList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearCompanyNameIdList: (state) => {
      state.userGroupNamesList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createUserGroupAsync.pending,
      (state: UserGroupState, action: any) => {
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyUserGroupAsync.pending,
      (state: UserGroupState, action: any) => {
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteUserGroupAsync.fulfilled,
      (state: UserGroupState, action: any) => {
        const { id } = action.meta.arg;
        state.userGroup = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteUserGroupAsync.rejected,
      (state: UserGroupState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createUserGroupAsync.fulfilled, getUserGroupByIdAsync.fulfilled),
      (state: UserGroupState, action: any) => {
        state.userGroup = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createUserGroupAsync.rejected, getUserGroupByIdAsync.rejected),
      (state: UserGroupState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getUserGroupAsync.fulfilled),
      (state: UserGroupState, action: any) => {
        state.userGroupList = action.payload;
        state.status = "idle";
        if (action.payload) {
          state.userGroupNamesList = [];
          action.payload.map((x: any) => {
            state.userGroupNamesList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getUserGroupAsync.rejected),
      (state: UserGroupState, action: any) => {
        state.status = "idle";
      }
    );
  },
});

export const {
  setUserGroup,
  clearUserGroup,
  setUserGroupList,
  clearUserGroupList,
} = userGroupSlice.actions;
