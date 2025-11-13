import s from "./App.module.css"
import { selectThemeMode, setIsLoggedIn } from "@/app/app-slice"
import { ErrorSnackbar, Header } from "@/common/components"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { Routing } from "@/common/routing"
import { useEffect } from "react"
import { CircularProgress } from "@mui/material"
import { useMeQuery } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const { data, isLoading } = useMeQuery()

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (isLoading) return
    if (data?.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }))
    }
  }, [isLoading])

  const theme = getTheme(themeMode)

  if (isLoading) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <div className={s.app}>
        <CssBaseline />
        <Header />
        <Routing />
        <ErrorSnackbar />
      </div>
    </ThemeProvider>
  )
}
