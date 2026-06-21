import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signIn, logout as serviceLogout } from "@/services/authService";

// ---- State ----
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("adminToken") : null,
  loading: false,
  error: null,
};

// ---- Thunks ----
export const login = createAsyncThunk(
  "auth/login",
  async (payload: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await signIn(payload);
      return data.data?.token || "";
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  serviceLogout();
});

// ---- Slice ----
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        localStorage.setItem("adminToken", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        localStorage.removeItem("adminToken");
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;