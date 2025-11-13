import { EditableSpan } from "@/common/components"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import { useChangeTodolistTitleMutation, useDeleteTodolistMutation } from "@/features/todolists/api/todolistsApi.ts"
import type { DomainTodolist } from "@/features/todolists/lib/types/types.ts"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title } = todolist
  const [deleteTodolist] = useDeleteTodolistMutation()
  const [changeTodolistTitle] = useChangeTodolistTitleMutation()


//variant no optimistic update
  // const dispatch = useAppDispatch()
  //
  // const changeTodolistStatus = (entityStatus: RequestStatus) => {
  //   dispatch(
  //     todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
  //       const todolist = state.find((todolist) => todolist.id === id)
  //       if (todolist) {
  //         todolist.entityStatus = entityStatus
  //       }
  //     }),
  //   )
  // }
  //
  // const deleteTodolist = () => {
  //   changeTodolistStatus("loading")
  //   removeTodolist(id)
  //     .unwrap()
  //     .catch(() => {
  //       changeTodolistStatus("idle")
  //     })
  // }

  // variant аналог аптимистик апдейт
  // const deleteTodolist = async() => {
  //   const pathResult = dispatch(
  //     todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
  //       const todolist = state.find((todolist) => todolist.id === id)
  //       if (todolist) {
  //         todolist.entityStatus = 'loading'
  //       }
  //     }),
  //   )
  // try{
  //   await removeTodolist(id).unwrap()
  // }catch {
  //   pathResult.undo()
  // Достанет метод из resultPath inversePath и вернет предыдущее значение
  // то есть значение где  todolist.entityStatus = 'loading' не лоадинг а что было до этого
  // }

  // }



  const deleteTodolistHandler = () => deleteTodolist(id)

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ id, title })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
      </h3>
      <IconButton onClick={deleteTodolistHandler} >
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
