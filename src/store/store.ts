import { configureStore } from '@reduxjs/toolkit';
import pollSlice from './pollSlice';
import sessionSlice from './sessionSlice';

export const store = configureStore({
  reducer: {
    poll: pollSlice,
    session: sessionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;