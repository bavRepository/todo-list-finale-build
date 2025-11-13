import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import { useCreateTodolistMutation } from "@/features/todolists/api/todolistsApi.ts"

export const Main = () => {
  // const dispatch = useAppDispatch()
  // const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const [createTodolist /*{ data }*/] = useCreateTodolistMutation() // data здесь не нужна не достаем тудулисты

  const createTodolistHandler = (title: string) => {
    createTodolist(title)
  }

  // if (!isLoggedIn) {
  //   return <Navigate to={Path.Login} />
  // }

  return (
    <Container maxWidth={"lg"}>
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={createTodolistHandler} />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
