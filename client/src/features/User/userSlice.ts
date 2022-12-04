import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { ISelectModel } from "../../models/Select";
import { IUser } from "../../models/User";

export interface UserState {
  user: IUser | null;
  userList: IUser[];
  userNameList: ISelectModel[];
  status: string;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  userList: [],
  userNameList: [],
};

export const getUsersAsync = createAsyncThunk<IUser[]>(
  "user/getUsers",
  async (thunkAPI: any) => {
    try {
      const userList = await agent.User.getAll();

      return userList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getUserByIdAsync = createAsyncThunk<IUser, { id: string }>(
  "user/getUserById",
  async ({ id }, thunkAPI: any) => {
    try {
      const userList = await agent.User.getById(id);

      return userList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getUsersByUserGroupIdAsync = createAsyncThunk<
  ISelectModel[],
  { userGroupId: string }
>(
  "userGroupMapping/getUsersByUserGroupId",
  async ({ userGroupId }, thunkAPI: any) => {
    try {
      const userGroupMappingList =
        await agent.UserGroupMapping.getUsersByUserGroupId(userGroupId);

      return userGroupMappingList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getUsersByCompanyIdAsync = createAsyncThunk<
  ISelectModel[],
  { companyId: string }
>("user/getUsersByCompanyId", async ({ companyId }, thunkAPI: any) => {
  try {
    const users = await agent.User.getUsersByCompanyId(companyId);

    return users;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const createUserAsync = createAsyncThunk<IUser, FieldValues>(
  "user/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const user = await agent.User.create(data);

      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyUserAsync = createAsyncThunk<
  IUser,
  { id: string; values: any }
>("user/getUserById", async ({ id, values }, thunkAPI: any) => {
  try {
    const user = await agent.User.modify(id, values);

    return user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteUserAsync = createAsyncThunk<IUser, { id: string }>(
  "user/deleteUser",
  async ({ id }, thunkAPI: any) => {
    try {
      const user = await agent.User.delete(id);

      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    clearUserList: (state) => {
      state.userList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createUserAsync.pending,
      (state: UserState, action: any) => {
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyUserAsync.pending,
      (state: UserState, action: any) => {
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteUserAsync.fulfilled,
      (state: UserState, action: any) => {
        const { id } = action.meta.arg;
        state.user = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteUserAsync.rejected,
      (state: UserState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createUserAsync.fulfilled, getUserByIdAsync.fulfilled),
      (state: UserState, action: any) => {
        state.user = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createUserAsync.rejected, getUserByIdAsync.rejected),
      (state: UserState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(getUsersAsync.fulfilled),
      (state: UserState, action: any) => {
        state.userList = action.payload;
        state.status = "idle";
        if (action.payload) {
          state.userNameList = [];
          action.payload.map((x: any) => {
            state.userNameList.push({
              id: x.id,
              name: x.firstName + " " + x.lastName,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getUsersAsync.rejected),
      (state: UserState, action: any) => {
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(
        getUsersByUserGroupIdAsync.fulfilled,
        getUsersByCompanyIdAsync.fulfilled
      ),
      (state: UserState, action: any) => {
        state.userList = action.payload;
        state.status = "idle";
        if (action.payload) {
          state.userNameList = [];
          action.payload.map((x: any) => {
            state.userNameList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(
        getUsersByUserGroupIdAsync.rejected,
        getUsersByCompanyIdAsync.rejected
      ),
      (state: UserState, action: any) => {
        state.status = "idle";
      }
    );
  },
});

export const { setUser, clearUser, setUserList, clearUserList } =
  userSlice.actions;
