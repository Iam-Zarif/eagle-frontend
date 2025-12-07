import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Api } from "@/api/Api";
import { Product } from "@/types/product";
import { db } from "@/config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { AppDispatch } from "@/store/store";

interface ProductState {
  products: Product[];
  fetchLoading: boolean;
  addLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  fetchLoading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (
    { page = 1, limit = 12 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(`${Api}/product?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      return res.data; 
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Request failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (product: Partial<Product>, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${Api}/product`, product, {
        withCredentials: true,
      });
      return res.data as Product;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Request failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    { id, data }: { id: string; data: Partial<Product> },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${Api}/product?id=${id}`, data, {
        withCredentials: true,
      });
      return res.data as Product;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Request failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${Api}/product?id=${id}`, { withCredentials: true });
      return id;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Request failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const subscribeProducts = () => (dispatch: AppDispatch) => {
  dispatch(setFetchLoading(true));

  const unsubscribe = onSnapshot(collection(db, "product"), (snapshot) => {
    const products: Product[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );

    dispatch(setProducts(products));
    dispatch(setFetchLoading(false));
  });

  return unsubscribe;
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.products = [];
      state.error = null;
      state.fetchLoading = false;
      state.addLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.error = null;
    },
    setFetchLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.fetchLoading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload as string;
      })

      .addCase(addProduct.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.addLoading = false;
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProduct.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.updateLoading = false;
          state.products = state.products.map((p) =>
            p.id === action.payload.id ? action.payload : p
          );
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteLoading = false;
          state.products = state.products.filter(
            (p) => p.id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetProducts, setProducts, setFetchLoading } =
  productSlice.actions;
export default productSlice.reducer;
