import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../../types/userTypes.ts';

interface UserState {
    currentUser: User | null;
    error: string | null;
    loading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signInSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    }
  },
});

export const { signInFailure, signInStart, signInSuccess, logout } = userSlice.actions;

export default userSlice.reducer;