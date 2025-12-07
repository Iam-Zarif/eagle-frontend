import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Api } from "@/api/Api";
import { Product } from "@/types/product";
import { User } from "@/types/user";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: Api, credentials: "include" }),
  tagTypes: ["Auth", "Products"], 
  endpoints: (builder) => ({
    login: builder.mutation<User, { username: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"], 
    }),

    getProducts: builder.query<Product[], void>({
      query: () => "/product",
      providesTags: ["Products"], 
    }),

    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: "/product",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"], 
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProductsQuery,
  useAddProductMutation,
} = apiSlice;
