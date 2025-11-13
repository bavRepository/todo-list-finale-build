import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants/constants.ts"
import { handleError } from "@/common/utils/handleError.ts"

export const baseApi = createApi({
  refetchOnReconnect: true,
  baseQuery: async (args, api, extraOptions) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 400)
    })

    const res = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
        "API-KEY": import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
      },
    })(args, api, extraOptions)

    handleError(api, res)

    return res
  },
  // Через сколько обновлять кэш keepUnusedDataFor : 120 можно убрать из глобального и оставить конкретному запросу
  // refetchOnFocus: true чтобы в компаненте сделать локально надо   const { data, isLoading } = useGetTasksQuery({id, params: {page: page}}, {refetchOnFocus: true})
  reducerPath: "baseApi",
  tagTypes: ["Todolist", "Task"],
  endpoints: () => ({}),
})
