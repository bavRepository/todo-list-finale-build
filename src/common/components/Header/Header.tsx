import {
  changeThemeModeAC,
  selectAppStatus,
  selectIsLoggedIn,
  selectThemeMode,
  setIsLoggedIn,
} from "@/app/app-slice.ts"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import LinearProgress from "@mui/material/LinearProgress"
import { NavLink } from "react-router"
import { Path } from "@/common/routing"
import { ResultCode } from "@/common/enums"
import { AUTH_TOKEN } from "@/common/constants/constants.ts"
import { useLogoutMutation } from "@/features/auth/api/authApi.ts"
import { NavButton } from "@/common/components"
import { getTheme } from "@/common/theme"
import { baseApi } from "@/app/baseApi.ts"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectAppStatus)
  const dispatch = useAppDispatch()
  const [logout] = useLogoutMutation()
  const theme = getTheme(themeMode)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  const onLogoutHandler = () => {
    logout()
      .unwrap()
      .then((res) => {
        if (res.resultCode === ResultCode.Success) {
          localStorage.removeItem(AUTH_TOKEN)
          dispatch(setIsLoggedIn({ isLoggedIn: false }))
        }
      })
      .then(() => {
        dispatch(baseApi.util.invalidateTags(["Task", "Todolist"]))
      })
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {isLoggedIn && <NavButton onClick={onLogoutHandler}>Logout</NavButton>}
            <NavLink style={{ marginRight: "20px" }} to={Path.Main}>
              Main
            </NavLink>
            <NavLink to={Path.Faq}>Faq</NavLink>
            <NavButton background={theme.palette.primary.dark}>Faq</NavButton>
            <Switch color={"default"} onChange={changeMode} />
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}
