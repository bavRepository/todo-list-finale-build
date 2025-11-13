import { ReactNode } from "react"
import { Navigate, Outlet } from "react-router"
import { Path } from "@/common/routing"

type ProtectedRoutesType = {
  children?: ReactNode
  isAllowed: boolean
  redirectPath?: string
}

export const ProtectedRoutes = ({ children, isAllowed, redirectPath = Path.Login }: ProtectedRoutesType) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} />
  }

  return children ?? <Outlet />
}
