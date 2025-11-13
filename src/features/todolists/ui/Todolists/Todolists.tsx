import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useFetchTodolistsQuery } from "@/features/todolists/api/todolistsApi.ts"
import { TodolistSkeleton } from "@/features/todolists/ui/Todolists/TodolistSkeleton/TodolistSkeleton.tsx"
import Box from "@mui/material/Box"
import { containerSx } from "@/common/styles"

export const Todolists = () => {
  // const todolists = useAppSelector(selectTodolists)
  //
  // const dispatch = useAppDispatch()
  //
  // useEffect(() => {
  //   dispatch(fetchTodolistsTC())
  // }, [])

  // 1.Отложка.Актуальный способ (со SKIP) когда нужно делать проверку на отрисовывать или нет по сути..
  // const [loading, setLoading] = useState(true)
  // const { data } = useFetchTodolistsQuery(undefined, { skip: loading })
  // const { data, refetch } = useFetchTodolistsQuery()
  const { data: todolists, isLoading } = useFetchTodolistsQuery()
  //2sposob s lazy лейзи возвращает не объект а массив уже но уже мы не можем делать проверку сразу отрисовываем и все
  // const [trigger, { data }] = useLazyFetchTodolistsQuery()

  //1
  // const fetchTodosHandler = () => {
  //   setLoading((prev) => !prev)
  // }

  //2
  // const fetchTodosHandler = () => {
  //   trigger()
  // }

  //2. Отложка.Актуальный без скип.
  // На самом деле 2 хука возвращаются в мутационных нету второго (лейзи), он есть только в query
  //   это в totolistapi файле делаем export const { useGetTodolistsQuery, useLazyGetTodolistsQuery } = todolistsApi
  if (isLoading) {
    return (
      <Box sx={containerSx} style={{ gap: "32px" }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
          ))}
      </Box>
    )
  }
  return (
    <>
      {/*<button onClick={refetch}>refetch</button>*/}
      {/*<button onClick={fetchTodosHandler}>Get todos</button>*/}
      {todolists?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
