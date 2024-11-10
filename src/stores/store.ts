import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { weatherApi } from "../services/weather.service";
import weatherReducer from "./slices/weather.slice";

import { userApi } from "../services/user.service";
import userReducer from "./slices/user.slice";

export const store = configureStore({
    reducer: {
        weather: weatherReducer,
        user : userReducer,
        [weatherApi.reducerPath]: weatherApi.reducer, 
        [userApi.reducerPath] : userApi.reducer,
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware()
            .concat(weatherApi.middleware)
            .concat(userApi.middleware); 
    },
});

setupListeners(store.dispatch);