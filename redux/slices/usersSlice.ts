import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "@/services/usersService";
import type { MarketplaceUser } from "@/services/usersService";

interface UsersState {
  items: MarketplaceUser[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  totalCount: 0,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (params: {
    SearchText?: string;
    Tier?: string;
    SubscriptionStatus?: string;
    IsActive?: boolean;
    PageNumber?: number;
    PageSize?: number;
  } | undefined, { rejectWithValue }) => {
    try {
      const response = await getUsers(params);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;