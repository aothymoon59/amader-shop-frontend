import { createContext, useContext, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateUser,
  useCurrentUser,
  type User as AuthUser,
  type UserRole,
} from "@/redux/features/auth/authSlice";
import { logoutUser } from "@/redux/features/auth/authActions";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  logout: () => void;
  updateProfile: (
    profile: Partial<Pick<AuthUser, "name" | "email" | "phone" | "address">>,
  ) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);

  const logout = () => {
    dispatch(logoutUser());
  };

  console.log("AuthContext user:", user);

  const updateProfile = (
    profile: Partial<Pick<AuthUser, "name" | "email" | "phone" | "address">>,
  ) => {
    dispatch(updateUser(profile));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export type { AuthUser, UserRole };
