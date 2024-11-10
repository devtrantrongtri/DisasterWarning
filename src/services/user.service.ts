import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    CreateLocationRequest,
    CreateLocationResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../interfaces/AuthType";

const baseUrl = import.meta.env.VITE_BASE_URL_V1;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (build) => ({


    getUsers: build.query({
      query: ({ page, size }) => ({
        url: `/user-management/user`,
        params: { page, size },
        headers: {
          accept: "*/*",
        },
      }),
    }),


    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/user-management/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),

    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (userInfo) => ({
        url: "/user-management/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userInfo,
      }),
    }),

    createLocation: build.mutation<CreateLocationResponse, CreateLocationRequest>({
        query: (locationInfo) => ({
          url: '/location-management/location',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: locationInfo,
        }),
      }),
  }),
});

export const { useGetUsersQuery, useLoginMutation,useRegisterMutation,useCreateLocationMutation } = userApi;
