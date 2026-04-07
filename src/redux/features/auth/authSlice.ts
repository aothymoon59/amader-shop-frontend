import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN" | "SUPER_ADMIN";

export type TUser = {
  id?: string;
  email?: string;
  name?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

type TAuthState = {
  user: TUser | null;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

export const roleMap: Record<string, UserRole> = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

export const normalizeUserRole = (role: unknown): UserRole => {
  const normalizedRole = String(role ?? "").trim();

  return roleMap[normalizedRole] ?? "CUSTOMER";
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: TUser | null; token: string | null }>,
    ) => {
      const { user, token } = action.payload;
      state.user = user
        ? {
            ...user,
            role: normalizeUserRole(user.role),
          }
        : null;
      state.token = token;
    },
    updateUser: (state, action: PayloadAction<Partial<TUser>>) => {
      if (!state.user) return;

      state.user = {
        ...state.user,
        ...action.payload,
        role: action.payload.role
          ? normalizeUserRole(action.payload.role)
          : state.user.role,
      };
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const currentToken = (state: RootState) => state.auth.token;
export const currentUser = (state: RootState) => state.auth.user;
export const useCurrentToken = currentToken;
export const useCurrentUser = currentUser;
export const logOut = logout;
export type User = TUser;
