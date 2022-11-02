import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { ICategory } from "../../models/Category";
import { ISelectModel } from "../../models/Select";

export interface CategoryState {
  category: ICategory | null;
  categoryList: ICategory[];
  categoryNamesList: ISelectModel[];
  status: string;
}

const initialState: CategoryState = {
  category: null,
  status: "idle",
  categoryList: [],
  categoryNamesList: [],
};

export const getCategoriesAsync = createAsyncThunk<ICategory[]>(
  "category/getCategories",
  async (thunkAPI: any) => {
    try {
      const categoryList = await agent.Category.getAll();

      return categoryList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const getCategoryByIdAsync = createAsyncThunk<ICategory, { id: string }>(
  "category/getCategoryById",
  async ({ id }, thunkAPI: any) => {
    try {
      const categoryList = await agent.Category.getById(id);

      return categoryList;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const createCategoryAsync = createAsyncThunk<ICategory, FieldValues>(
  "category/create",
  async (data: FieldValues, thunkAPI: any) => {
    try {
      const category = await agent.Category.create(data);

      return category;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const modifyCategoryAsync = createAsyncThunk<
  ICategory,
  { id: string; values: any }
>("category/getCategoryById", async ({ id, values }, thunkAPI: any) => {
  try {
    const category = await agent.Category.modify(id, values);

    return category;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error!.data });
  }
});

export const deleteCategoryAsync = createAsyncThunk<ICategory, { id: string }>(
  "category/deleteCategory",
  async ({ id }, thunkAPI: any) => {
    try {
      const category = await agent.Category.delete(id);

      return category;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error!.data });
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    clearCategory: (state) => {
      state.category = null;
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
    clearCategoryList: (state) => {
      state.categoryList = [];
    },
    setCategoryNameIdList: (state, action) => {
      if (action.payload) {
        state.categoryNamesList = [];
        action.payload.map((x: any) => {
          state.categoryNamesList.push({
            id: x.id,
            name: x.name,
          });
        });
      }
    },
    clearCategoryNameIdList: (state) => {
      state.categoryNamesList = [];
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      createCategoryAsync.pending,
      (state: CategoryState, action: any) => {
        console.log(action);
        state.status = "pendingAddItem" + action.meta.arg.id;
      }
    );

    builder.addCase(
      modifyCategoryAsync.pending,
      (state: CategoryState, action: any) => {
        console.log(action);
        state.status =
          "pendingRemoveItem" + action.meta.arg.id + action.meta.arg.name;
      }
    );
    builder.addCase(
      deleteCategoryAsync.fulfilled,
      (state: CategoryState, action: any) => {
        const { id } = action.meta.arg;
        state.category = null;
        state.status = "idle";
      }
    );
    builder.addCase(
      deleteCategoryAsync.rejected,
      (state: CategoryState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(createCategoryAsync.fulfilled, getCategoryByIdAsync.fulfilled),
      (state: CategoryState, action: any) => {
        state.category = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(createCategoryAsync.rejected, getCategoryByIdAsync.rejected),
      (state: CategoryState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addMatcher(
      isAnyOf(getCategoriesAsync.fulfilled),
      (state: CategoryState, action: any) => {
        state.categoryList = action.payload;
        state.status = "idle";

        if (action.payload) {
          state.categoryNamesList = [];
          action.payload.map((x: any) => {
            state.categoryNamesList.push({
              id: x.id,
              name: x.name,
            });
          });
        }
      }
    );
    builder.addMatcher(
      isAnyOf(getCategoriesAsync.rejected),
      (state: CategoryState, action: any) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});

export const {
  setCategory,
  clearCategory,
  setCategoryList,
  clearCategoryList,
} = categorySlice.actions;
