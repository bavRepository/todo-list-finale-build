import { LoginInputs } from "@/features/auth/Login/Login.tsx"
import { authMeResponse, authOperationResponse, getCaptchaResponse } from "@/features/auth/api/authApit.types.ts"
import { DefaultResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getCaptchaUrl: builder.query<getCaptchaResponse, void>({
        query: () => "/security/get-captcha-url",
      }),
      login: builder.mutation<authOperationResponse, LoginInputs>({
        query: (payload) => ({ method: "post", url: "auth/login", body: payload }),
      }),
      logout: builder.mutation<DefaultResponse, void>({
        query: () => ({ method: "delete", url: "auth/login" }),
      }),
      me: builder.query<authMeResponse, void>({
        query: () => "/auth/me",
      }),
    }
  },
})

export const { useLoginMutation, useLogoutMutation, useMeQuery, useGetCaptchaUrlQuery } = authApi
