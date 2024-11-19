import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Disaster,
  CreateDisasterRequest,
  CreateDisasterResponse,
  CreateDisasterInfoRequest,
  CreateDisasterInfoResponse,
  DisasterWarning,
  GetDisasterByIdResponse
} from "../interfaces/DisasterType";

const baseUrl = import.meta.env.VITE_BASE_URL_V1;

export const disasterApi = createApi({
  reducerPath: "disasterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      console.log("token header is: ", token);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
    responseHandler: async (response) => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    },
  }),

  endpoints: (builder) => ({
    getDisasters: builder.query<
        { content: Disaster[]; totalElements: number; totalPages: number; size: number },
        { page: number; size: number }>({
        query: ({ page, size }) => ({
          url: `/disaster-management/disaster`,
          params: { page, size },
        }),
        transformResponse: (response: { message: string; data: { content: Disaster[]; totalElements: number; totalPages: number; size: number } }) =>
          response.data,
      }),


    getDisasterById: builder.query<GetDisasterByIdResponse, number>({
      query: (disasterId) => ({
        url: `/disaster-management/disaster/${disasterId}`,
        method: "GET",
      }),
    }),

    createDisaster: builder.mutation<CreateDisasterResponse, CreateDisasterRequest>({
      query: (newDisaster) => {
        const formData = new FormData();

        formData.append('disaster', JSON.stringify(newDisaster.disaster)); 
        
        if (newDisaster.images) {
          formData.append('images', newDisaster.images);
        }
    
        return {
          url: '/disaster-management/disaster',
          method: 'POST',
          body: formData,
        };
      },
    }),
    
    
    
    createDisasterInfo: builder.mutation<CreateDisasterInfoResponse, CreateDisasterInfoRequest>({
      query: (newDisasterInfo) => {
        const formData = new FormData();
    
        formData.append("disasterInfo", JSON.stringify(newDisasterInfo.disasterInfo));

        newDisasterInfo.images?.forEach((image, index) => {
          if (image.imageFile) {
            formData.append(`images[${index}]`, image.imageFile);
          }
        });
    
        return {
          url: `/disaster-info-management/disaster-info`,
          method: "POST",
          body: formData,
          headers: {
            accept: "*/*",
          },
        };
      },
    }),
    

    getDisasterWarnings: builder.query<DisasterWarning[], void>({
      query: () => ({
        url: `/disaster-warnings`,
        method: "GET",
        headers: {
          accept: "*/*",
        },
      }),
    }),

    // Delete Disaster Mutation
    deleteDisaster: builder.mutation<void, number>({
      query: (disasterId) => ({
        url: `/disaster-management/disaster/${disasterId}`,
        method: "DELETE",
      }),
    }),

    // Delete Disaster Info Mutation
    deleteDisasterInfo: builder.mutation<void, number>({
      query: (disasterInfoId) => ({
        url: `/disaster-info-management/disaster-info/${disasterInfoId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDisastersQuery,
  useGetDisasterByIdQuery,
  useCreateDisasterMutation,
  useCreateDisasterInfoMutation,
  useGetDisasterWarningsQuery,
  useDeleteDisasterMutation,
  useDeleteDisasterInfoMutation,
} = disasterApi;
