import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCustomerSubscription,
  getSubscriptionHistory,
  grantSubscription,
  cancelSubscription,
  expireSubscription,
  changeSubscriptionPlan,
  confirmSubscription,
  resumeRenewal,
} from "@/services/subscriptionsService";
import { fetchUsers } from "./usersSlice";

interface SubscriptionsState {
  current: any | null;
  history: any[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;
}

const initialState: SubscriptionsState = {
  current: null,
  history: [],
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
};

// Fetch current subscription for a specific customer
export const fetchCustomerSubscription = createAsyncThunk(
  "subscriptions/fetchCurrent",
  async (customerGuid: string, { rejectWithValue }) => {
    try {
      const response = await getCustomerSubscription(customerGuid);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch subscription history for a specific customer
export const fetchSubscriptionHistory = createAsyncThunk(
  "subscriptions/fetchHistory",
  async (customerGuid: string, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionHistory(customerGuid);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Grant a subscription (and refresh users afterwards)
export const grant = createAsyncThunk(
  "subscriptions/grant",
  async (
    payload: {
      customerGuid: string;
      plan: string;
      billingInterval: string;
      subscriptionExpiresAtUtc?: string;
      reason?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await grantSubscription(payload);
      dispatch(fetchUsers({})); // refresh the users list
      return null;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Cancel a subscription (and refresh users afterwards)
export const cancel = createAsyncThunk(
  "subscriptions/cancel",
  async (payload: { customerGuid: string; reason?: string }, { dispatch, rejectWithValue }) => {
    try {
      await cancelSubscription(payload);
      dispatch(fetchUsers({}));
      return null;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Expire a subscription (and refresh users afterwards)
export const expire = createAsyncThunk(
  "subscriptions/expire",
  async (payload: { customerGuid: string; reason?: string }, { dispatch, rejectWithValue }) => {
    try {
      await expireSubscription(payload);
      dispatch(fetchUsers({}));
      return null;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Change a subscription plan (and refresh users afterwards)
export const changePlan = createAsyncThunk(
  "subscriptions/changePlan",
  async (
    payload: { customerGuid: string; plan: string; billingInterval: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await changeSubscriptionPlan(payload);
      dispatch(fetchUsers({}));
      return null;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const resume = createAsyncThunk(
  "subscriptions/resume",
  async (customerGuid: string, { dispatch, rejectWithValue }) => {
    try {
      await resumeRenewal(customerGuid);
      dispatch(fetchUsers({}));
      return null;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    clearSubscription: (state) => {
      state.current = null;
      state.history = [];
      state.error = null;
    },
    clearActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch current
    builder
      .addCase(fetchCustomerSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchCustomerSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Fetch history
    builder
      .addCase(fetchSubscriptionHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
    // Grant
    builder
      .addCase(grant.pending, (state) => { state.actionLoading = true; state.actionError = null; })
      .addCase(grant.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(grant.rejected, (state, action) => { state.actionLoading = false; state.actionError = action.payload as string; });
    // Cancel
    builder
      .addCase(cancel.pending, (state) => { state.actionLoading = true; state.actionError = null; })
      .addCase(cancel.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(cancel.rejected, (state, action) => { state.actionLoading = false; state.actionError = action.payload as string; });
    // Expire
    builder
      .addCase(expire.pending, (state) => { state.actionLoading = true; state.actionError = null; })
      .addCase(expire.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(expire.rejected, (state, action) => { state.actionLoading = false; state.actionError = action.payload as string; });
    // Change plan
    builder
      .addCase(changePlan.pending, (state) => { state.actionLoading = true; state.actionError = null; })
      .addCase(changePlan.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(changePlan.rejected, (state, action) => { state.actionLoading = false; state.actionError = action.payload as string; });
  },
});

export const { clearSubscription, clearActionError } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;