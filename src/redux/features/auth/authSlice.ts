import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type UserRole = "customer" | "provider" | "admin" | "super-admin";

export type TUser = {
  id?: string;
  email?: string;
  name?: string;
  role: UserRole;
  providerProfile?: {
    id?: string;
    shopName?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    isActive?: boolean;
  } | null;
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
  CUSTOMER: "customer",
  customer: "customer",
  PROVIDER: "provider",
  provider: "provider",
  ADMIN: "admin",
  admin: "admin",
  SUPER_ADMIN: "super-admin",
  super_admin: "super-admin",
  "super-admin": "super-admin",
};

export const normalizeUserRole = (role: unknown): UserRole => {
  const normalizedRole = String(role ?? "").trim();

  return roleMap[normalizedRole] ?? "customer";
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
