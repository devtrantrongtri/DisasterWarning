import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeatherData } from "../../interfaces/WeatherNewType";

interface WeatherState {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: WeatherState = {
    data: null,
    loading: false,
    error: null,
  };
  
  const weatherNewSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
      startLoading(state) {
        state.loading = true;
        state.error = null;
      },
      setWeatherData(state, action: PayloadAction<WeatherData>) {
        state.data = action.payload;
        state.loading = false;
      },
      setError(state, action: PayloadAction<string>) {
        state.error = action.payload;
        state.loading = false;
      },
    },
  });
  
  export const { startLoading, setWeatherData, setError } = weatherNewSlice.actions;
  const weatherNewReducer = weatherNewSlice.reducer;
  export default weatherNewReducer;