import { Route, Routes } from "react-router"
import { Main } from "@/app/Main.tsx"
import { Login } from "@/features/auth/Login/Login.tsx"
import { PageNotFound } from "@/common/components/NotFound/NotFound.tsx"
import { Faq } from "@/common/components/Faq/Faq.tsx"
import { ProtectedRoutes } from "@/common/components/ProtectedRoutes/ProtectedRoutes.tsx"
import { useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/app/app-slice.ts"

export const Path = {
  Main: "/",
  Login: "/login",
  Faq: "/faq",
  PageNotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  return (
    <Routes>
      <Route element={<ProtectedRoutes isAllowed={isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
        <Route path={Path.Faq} element={<Faq />} />
      </Route>

      <Route element={<ProtectedRoutes isAllowed={!isLoggedIn} redirectPath={Path.Main} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>

      {/*<Route*/}
      {/*  path={Path.Main}*/}
      {/*  element={*/}
      {/*    <ProtectedRoutes isAllowed={isLoggedIn}>*/}
      {/*      <Main />*/}
      {/*    </ProtectedRoutes>*/}
      {/*  }*/}
      {/*/>*/}

      {/*<Route*/}
      {/*  path={Path.Faq}*/}
      {/*  element={*/}
      {/*    <ProtectedRoutes isAllowed={isLoggedIn}>*/}
      {/*      <Faq />*/}
      {/*    </ProtectedRoutes>*/}
      {/*  }*/}
      {/*/>*/}

      {/*<Route*/}
      {/*  path={Path.Login}*/}
      {/*  element={*/}
      {/*    <ProtectedRoutes isAllowed={!isLoggedIn} redirectPath={Path.Main}>*/}
      {/*      <Login />*/}
      {/*    </ProtectedRoutes>*/}
      {/*  }*/}
      {/*/>*/}
      {/*<Route path={Path.Main} element={<Main />} />*/}
      {/*<Route path={Path.Login} element={<Login />} />*/}
      {/*<Route path={Path.Faq} element={<Faq />} />*/}

      <Route path={Path.PageNotFound} element={<PageNotFound />} />
    </Routes>
  )
}
