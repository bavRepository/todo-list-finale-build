import { DefaultResponse } from "@/common/types"
import type { CreateTodolistResponse, Todolist } from "./todolistsApi.types"
import { baseApi } from "@/app/baseApi.ts"
import { DomainTodolist } from "@/features/todolists/lib/types/types.ts"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      fetchTodolists: builder.query<DomainTodolist[], void>({
        query: () => "/todo-lists",
        transformResponse: (todolists: Todolist[]) => {
          return todolists.map((tl) => ({ ...tl, filter: "all" }))
        },
        providesTags: ["Todolist"],
      }),
      createTodolist: builder.mutation<CreateTodolistResponse, string>({
        query: (title) => ({ method: "post", url: "/todo-lists", body: { title } }),
        invalidatesTags: ["Todolist"],
      }),
      deleteTodolist: builder.mutation<DefaultResponse, string>({

        query: (id) => ({ method: "delete", url: `/todo-lists/${id}` }),
        // Когда идет запрос мы  попадем именно сразу сюда в onQueryStarted а не в query
        onQueryStarted: async (todolistId , { dispatch,queryFulfilled }) => {
          const patchResult = dispatch(
            todolistsApi.util.updateQueryData("fetchTodolists", undefined, (state) => {
              const index = state.findIndex((todolist) => todolist.id === todolistId)
              if (index !== -1) {
                state.splice(index, 1)
              }
            }),
          )
          try {
            await queryFulfilled
          } catch {
            patchResult.undo()
          }
        },
        invalidatesTags: ["Todolist"],
      }),
      changeTodolistTitle: builder.mutation<DefaultResponse, { id: string; title: string }>({
        query: ({ id, title }) => ({ method: "put", url: `/todo-lists/${id}`, body: { title } }),
        invalidatesTags: ["Todolist"],
      }),
    }
  },
})
// На самом деле 2 хука возвращаются в мутационных нету второго (лейзи), он есть только в query
export const {
  useFetchTodolistsQuery,
  useCreateTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
} = todolistsApi
