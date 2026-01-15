// Temporary test store without authSlice to isolate the issue
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // Empty for now - to test if authSlice is the issue
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
