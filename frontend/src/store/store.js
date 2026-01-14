// This file is your Redux Store configuration.
// It sets up global state management for your React app using Redux Toolkit.

import { configureStore } from '@reduxjs/toolkit' // Import configureStore from Redux Toolkit
import authReducer from './slices/authSlice' // Import authReducer from authSlice


// Create Redux store
export const store = configureStore({
    // Register reducers (state slices)
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
        //       Why disable serializable check?
        // Redux expects state to be serializable (plain JSON).
    }),
})


// 🔹 Redux = global memory
// 🔹 Store = main container
// 🔹 Reducer = section of memory
// 🔹 Provider = gives access to memory