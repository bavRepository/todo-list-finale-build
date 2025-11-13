import { DefaultResponse } from "@/common/types"
import type { GetTasksResponse, TaskOperationResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi.ts"
import { PAGE_SIZE } from "@/common/constants/constants.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //1variant как передавать параметры
    // getTasks: build.query<GetTasksResponse, {id: string, params: {count: number, page: number}}>({
    //   query: ({id, params}) => `todo-lists/${id}/tasks?count=${params.count}&${params.page}`,
    //2 вариант как передавать параметры
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { page: number } }>({
      query: ({ todolistId, params }) => {
        return {
          url: `todo-lists/${todolistId}/tasks`,
          params: { ...params, count: PAGE_SIZE },
        }
      },
      // providesTags: ["Task"],
      //
      // providesTags:(result, error, arg, meta)=>{},
      // result - ответ от сервера то есть таски нашего тудулиста
      // arg - аргументы что передавались в запрос в нашем сл. это todolistId
      //
      /**
       * todo1
       * [
       * { type: "Task", id: "1", },
       * { type: "Task", id: "2", },
       * { type: "Task", id: "3", },
       * { type: "Task", id: "4", }
       * { type: "Task", id: "todolistId1" }
       * ]
       *
       * todo2
       * [
       * { type: "Task", id: "1", },
       * { type: "Task", id: "2", },
       * { type: "Task", id: "3", },
       * { type: "Task", id: "todolistId2" }
       * ]
       */
      // Вот такую схему тэга у нас нарисовало при вервом фетче тасок
    // 1 variant
    //   providesTags: (res, _err, { todolistId }) =>
    //     res ? [...res.items.map(({ id }) => ({ type: "Task", id }) as const), { type: "Task", id: todolistId }] : ["Task"],
    // }),
//2 variant
    providesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id: todolistId }],
  }),
    createTask: build.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: "Task", id: arg.todolistId }],
    }),
    deleteTask: build.mutation<DefaultResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      // Инвалидейт тегс для обновления кеша
      // var 1 invalidatesTags: (_res, _err, { taskId }) => [{ type: "Task", id: taskId }],

      invalidatesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id:  todolistId}],
    }),
    updateTask: build.mutation<TaskOperationResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
      query: ({ todolistId, taskId, model }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(), 'getTasks')

        let patchResults: any[] = []
          //1 вариант const args = tasksApi.util.selectCachedArgs ForQuery(getState(),
          // "getTasks")  но он плохой так как берут [0] или [1] мало по одной берет странице

        cachedArgsForQuery.forEach(({ params }) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData(
                'getTasks',
                //   { todolistId, params: { page: params.page } }, он будет сравнивать эту строку со стракой в кэше в ключе чтобы все совпадало и если не ок все это не мой запрос и он с этим работаь не будет
                { todolistId, params: { page: params.page } },
                state => {
                  const index = state.items.findIndex(task => task.id === taskId)
                  if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...model }
                  }
                }
              )
            )
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach(patchResult => {
            patchResult.undo()
          })
        }
      },
      //1 var // var 1 invalidatesTags: (_res, _err, { taskId }) => [{ type: "Task", id: taskId }],/
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id:  todolistId}],
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi
