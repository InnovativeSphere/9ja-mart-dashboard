import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardOverview } from "@/services/dashboardService";
import type { DashboardOverviewResponse } from "@/services/dashboardService";

interface DashboardState {
  data: DashboardOverviewResponse["data"] | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      // Pass RecentLimit so the recent* arrays are populated
      const response = await getDashboardOverview({ RecentLimit: 5 });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;