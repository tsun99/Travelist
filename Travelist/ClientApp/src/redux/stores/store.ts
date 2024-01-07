import { configureStore } from '@reduxjs/toolkit';

import destinationSearchReducer from '../slices/destinationSearchSlice.ts';
import uiReducer from '../slices/uiSlice.ts';
import userReducer from '../slices/userSlice.ts';

const store = configureStore({
  reducer: {
    user: userReducer,
    destinationSearch: destinationSearchReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;