// src/store/weatherSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData } from '../../interfaces/WeatherType';


interface WeatherState {
  data: WeatherData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  typeWeather:string;
}

const initialState: WeatherState = {
  data: null,
  status: 'idle',
  error: null,
  typeWeather:'sunset'
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherData(state, action: PayloadAction<WeatherData>) {
      state.data = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    resetWeather(state) {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
    setType(state,action){
      state.typeWeather = action.payload;
    }
  },
});

export const { setWeatherData, setLoading, setError, resetWeather,setType } = weatherSlice.actions;

export default weatherSlice.reducer;
