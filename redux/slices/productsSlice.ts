import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductById,
  deleteProduct as serviceDeleteProduct,
} from "@/services/productsService";
import type { ProductItem } from "@/services/productsService";

interface ProductsState {
  items: ProductItem[];
  totalCount: number;
  selectedProduct: ProductItem | null;
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: ProductsState = {
  items: [],
  totalCount: 0,
  selectedProduct: null,
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
};

// Fetch products list – handles empty DB gracefully
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (params: {
    PageNumber?: number;
    PageSize?: number;
    IsAvailable?: boolean;
    IsUnavailable?: boolean;
    Category?: string;
  } | undefined, { rejectWithValue }) => {
    try {
      const response = await getProducts(params);
      return response.data;
    } catch (err: any) {
      // Treat "No product found" as empty list (backend sends 400 with that message)
      if (err.message === "No product found") {
        return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20 };
      }
      return rejectWithValue(err.message);
    }
  }
);

// Fetch single product detail
export const fetchProductDetail = createAsyncThunk(
  "products/fetchDetail",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await getProductById(productId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId: number, { dispatch, rejectWithValue }) => {
    try {
      await serviceDeleteProduct(productId);
      dispatch(fetchProducts({})); // refresh the list
      return null;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;