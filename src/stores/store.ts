import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { weatherApi } from "../services/weather.service";
import weatherReducer from "./slices/weather.slice";

import { userApi } from "../services/user.service";
import userReducer from "./slices/user.slice";
import weatherNewReducer from "./slices/weatherNew.slice";
import { weatherNewApi } from "../services/weatherNew.service";

export const store = configureStore({
    reducer: {
        weather: weatherReducer,
        weatherNew: weatherNewReducer,
        user : userReducer,
        [weatherApi.reducerPath]: weatherApi.reducer, 
        [weatherNewApi.reducerPath]: weatherNewApi.reducer, 
        [userApi.reducerPath] : userApi.reducer,
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware()
            .concat(weatherApi.middleware)
            .concat(weatherNewApi.middleware)
            .concat(userApi.middleware); 
    },
});

setupListeners(store.dispatch);