import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateLocationRequest,
  CreateLocationResponse,
  GetUserByIdResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  CountTokenRequest,
  ChangePasswordDTO,
  UserUpdate,
} from "../interfaces/AuthType";
import ChangePasswordPopup from "../pages/auth/ChangPassword";
import { WarningResponse } from "../interfaces/DisasterType";

const baseUrl = import.meta.env.VITE_BASE_URL_V1;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      let token = sessionStorage.getItem("token");
      if(token === null) {
        token = localStorage.getItem("token")
      }
      console.log(token)
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
    responseHandler: async (response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    },
  }),

  endpoints: (build) => ({
    getUsers: build.query({
      query: ({ page, size }) => ({
        url: `/user-management/user`,
        params: { page, size },
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
        body: userInfo,
      }),
    }),

    createLocation: build.mutation<CreateLocationResponse, CreateLocationRequest>({
      query: (locationInfo) => ({
        url: '/location-management/location/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: locationInfo,
      }),
    }),

    sendOtp: build.mutation<void, string>({
      query: (email) => ({
        url: `/forgot-password/send-otp`,
        method: "POST",
        params: { email },
        headers: {
          accept: "*/*",
        },
      }),
    }),

    updateUser: build.mutation<void, UserUpdate>({
      query: (user) => ({
        url: `/user-management/user/${user.userId}`,
        method: "PUT",
        body: user,
      }),
    }),

    changePassword: build.mutation<void, ChangePasswordDTO>({
      query: (formData) => ({
        url: "/forgot-password/change_password",
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        // },
        body: formData,  // Send formData directly as the body
      }),
    }),

    getUserById: build.query<GetUserByIdResponse, number>({
      query: (userId) => {
        // const token = sessionStorage.getItem("token");
        return {
          url: `/user-management/user/${userId}`,
          method: "GET",
          // headers: {
          //   accept: "*/*",
          //   Authorization: `Bearer ${token}`,
          // },
        };
      },
    }),

    CountToken: build.query<CountTokenRequest, number>({
      query: (userId) => {
        const token = sessionStorage.getItem("token");
        return {
          url: `/user-management/user/CountToken/${userId}`,
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getCreateWarning: build.query<String,any>({
      query: () => ({
        url: `/disaster-warning-management/disaster-warning/sendWarning`,
        method:'GET'
      }),
    }),

    getWarning: build.query<WarningResponse, void>({
      query: () => ({
        url: '/disaster-warning-management/disaster-warning/location',
        method: 'GET',
      }),
    }),

  }),
});

export const {
  useGetUsersQuery,
  useLoginMutation,
  useRegisterMutation,
  useCreateLocationMutation,
  useSendOtpMutation, 
  useChangePasswordMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useCountTokenQuery,
  useGetCreateWarningQuery,
  useGetWarningQuery
} = userApi;
