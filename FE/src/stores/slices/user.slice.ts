import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse, User } from '../../interfaces/AuthType';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  token: string | null;
  isAuthen: boolean;
  userName: string | null;
  email: string | null;
  role: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  token: null,
  isAuthen: false,
  userName: null,
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse['data']>) => {
      state.token = action.payload.token;
      state.isAuthen = true;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthen = false;
      state.userName = null;
      state.email = null;
      state.role = null;
    },
    setGmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
  },
});

export const { setUsers, setLoading, setError, loginSuccess, logout ,setGmail} = userSlice.actions;

const  userReducer =  userSlice.reducer;
export default  userReducer;