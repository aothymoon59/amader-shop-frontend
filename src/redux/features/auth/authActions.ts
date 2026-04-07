import { baseApi } from "@/redux/api/baseApi";
import { persistor, type AppDispatch } from "@/redux/store";
import { authApi } from "./authApi";
import { logout, setUser } from "./authSlice";

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await dispatch(authApi.endpoints.logout.initiate(undefined)).unwrap();
  } catch {
    dispatch(setUser({ user: null, token: null }));
  } finally {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    await persistor.flush();
  }
};
