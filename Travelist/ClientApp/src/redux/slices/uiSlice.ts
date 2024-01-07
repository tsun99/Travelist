import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  viewportWidth: number;
}

const initialState: UIState = {
  viewportWidth: window.innerWidth,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setViewportWidth: (state, action: PayloadAction<number>) => {
      state.viewportWidth = action.payload;
    },
  },
});

export const { setViewportWidth } = uiSlice.actions;
export default uiSlice.reducer;