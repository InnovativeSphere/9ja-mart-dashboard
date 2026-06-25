import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPlans, createPlan, updatePlan } from "@/services/plansService";
import type { CreatePlanPayload, PlanListItem } from "@/services/plansService";

interface PlansState {
  items: PlanListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PlansState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all plans
export const fetchPlans = createAsyncThunk(
  "plans/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPlans();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Add a new plan
export const addPlan = createAsyncThunk(
  "plans/add",
  async (payload: CreatePlanPayload, { rejectWithValue }) => {
    try {
      await createPlan(payload);
      // Refresh the list after creation
      const response = await getPlans();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Edit an existing plan
export const editPlan = createAsyncThunk(
  "plans/edit",
  async (
    payload: {
      plan: string;                       // e.g. "Vendor"
      billingInterval: string;           // e.g. "Monthly"
      updates: Partial<CreatePlanPayload> & { updateExistingSubscriptions?: boolean };
    },
    { rejectWithValue }
  ) => {
    try {
      await updatePlan(
        { plan: payload.plan, billingInterval: payload.billingInterval },
        payload.updates
      );
      const response = await getPlans();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(editPlan.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default plansSlice.reducer;