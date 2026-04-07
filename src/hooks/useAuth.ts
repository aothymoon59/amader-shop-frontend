import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useCurrentToken,
  updateUser,
  useCurrentUser,
  type User as AuthUser,
  type UserRole,
} from "@/redux/features/auth/authSlice";
import { logoutUser } from "@/redux/features/auth/authActions";
import { useGetMeQuery } from "@/redux/features/auth/usersApi";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);

  const { data: userDataFromApi } = useGetMeQuery(undefined, { skip: !token });

  const logout = () => {
    dispatch(logoutUser());
  };

  const updateProfile = (
    profile: Partial<Pick<AuthUser, "name" | "email" | "phone" | "address">>,
  ) => {
    dispatch(updateUser(profile));
  };

  return {
    user,
    userData: userDataFromApi?.data ?? null,
    isAuthenticated: Boolean(user),
    logout,
    updateProfile,
  };
};

export type { AuthUser, UserRole };
