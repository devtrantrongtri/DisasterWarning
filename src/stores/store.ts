import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { weatherApi } from "../services/weather.service";
import weatherReducer from "./slices/weather.slice";

export const store = configureStore({
    reducer: {
        weather: weatherReducer,
        [weatherApi.reducerPath]: weatherApi.reducer, // Add weatherApi reducer
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware()
            .concat(weatherApi.middleware); // Add weatherApi middleware
    },
});

setupListeners(store.dispatch);