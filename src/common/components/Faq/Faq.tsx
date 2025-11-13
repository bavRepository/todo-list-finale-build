import { useFetchTodolistsQuery } from "@/features/todolists/api/todolistsApi.ts"

export const Faq = () => {
  const { data } = useFetchTodolistsQuery()

  return (
    <div>
      <h1>FAQ</h1>
      <p>
        {data?.map((todolist) => {
          return <div>{todolist.title}</div>
        })}
      </p>
    </div>
  )
}
