import { baseApi } from "@/redux/api/baseApi";
import { persistor, type AppDispatch } from "@/redux/store";
import { authApi } from "./authApi";
import { logout, setUser } from "./authSlice";

type LogoutUserOptions = {
  callApi?: boolean;
};

export const logoutUser =
  (options: LogoutUserOptions = {}) => async (dispatch: AppDispatch) => {
    const { callApi = true } = options;

  try {
    if (callApi) {
      await dispatch(authApi.endpoints.logout.initiate(undefined)).unwrap();
    }
  } catch {
    dispatch(setUser({ user: null, token: null }));
  } finally {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    await persistor.flush();
  }
  };
