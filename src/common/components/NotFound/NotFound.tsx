import s from "./NotFound.module.css"
import Button from "@mui/material/Button"
import { Link } from "react-router"
import { Path } from "@/common/routing"

export const PageNotFound = () => (
  <>
    <h1 className={s.title}>404</h1>
    <h2 className={s.subtitle}>page not found</h2>
    <Button
      component={Link}
      to={Path.Main}
      variant="contained"
      color="primary"
      style={{ width: "120px", margin: "0 auto" }}
    >
      RETURN
    </Button>
  </>
)
