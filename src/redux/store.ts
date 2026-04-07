import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { baseApi } from "./api/baseApi";

type AuthState = ReturnType<typeof authReducer>;

const persistConfig: PersistConfig<AuthState> = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer<AuthState>(
  persistConfig,
  authReducer,
);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// ✅ Types for typed hooks (useAppDispatch/useAppSelector)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
