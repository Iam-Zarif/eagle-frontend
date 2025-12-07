
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/types/user";
import { Api } from "@/api/Api";

export const api = createApi({
  reducerPath: "api", 
  baseQuery: fetchBaseQuery({ baseUrl: `${Api}/api` }),
  endpoints: (builder) => ({
    login: builder.mutation<User, { username: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = api;
