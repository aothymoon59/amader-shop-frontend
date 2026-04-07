import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagTypes";
import { logOut, setUser } from "../features/auth/authSlice";

import type { RootState } from "../store";

const skipAuthEndpoints = ["getSiteSettingsContent"] as const;

type SkipAuthEndpoint = (typeof skipAuthEndpoints)[number];

const isSkipAuthEndpoint = (endpoint: string): endpoint is SkipAuthEndpoint => {
  return (skipAuthEndpoints as readonly string[]).includes(endpoint);
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    if (isSkipAuthEndpoint(endpoint)) return headers; // skip Authorization

    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);

    return headers;
  },
});

type RefreshResponse = {
  accessToken?: string;
};

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // Only try refresh if user is still logged in
  const isLoggedIn = Boolean((api.getState() as RootState).auth.token);

  if (result?.error?.status === 401) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data: RefreshResponse = await res.json();

      if (data?.accessToken) {
        const user = (api.getState() as RootState).auth.user;

        api.dispatch(
          setUser({
            user,
            token: data.accessToken,
          }),
        );

        // retry original request
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
      }
    } catch (e) {
      console.error("Refresh token failed", e);
      api.dispatch(logOut());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
