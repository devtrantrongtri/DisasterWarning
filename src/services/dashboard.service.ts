import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = import.meta.env.VITE_BASE_URL_V1;
// Tạo API slice
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl, // Đảm bảo baseUrl đúng với backend của bạn
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserCount: builder.query<number, void>({
      query: () => '/dashboard-management/user-count',
    }),
    getAlertCount: builder.query<number, void>({
      query: () => '/dashboard-management/alert-count',
    }),
  }),
});

export const { useGetUserCountQuery, useGetAlertCountQuery } = dashboardApi;
