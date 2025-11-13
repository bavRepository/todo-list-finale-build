import { selectThemeMode, setAppErrorAC, setIsLoggedIn } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { Controller, useForm } from "react-hook-form"
import s from "./Login.module.css"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginShema } from "@/features/auth/lib/shemas"
import { useGetCaptchaUrlQuery, useLoginMutation } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums"
import { AUTH_TOKEN } from "@/common/constants/constants.ts"
import { useState } from "react"

export type LoginInputs = z.infer<typeof loginShema>

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  const [login] = useLoginMutation()


  const [isCaptchaRequired, setIsCaptchaRequired] = useState<boolean>(false)
  const {data} = useGetCaptchaUrlQuery(undefined, { skip: isCaptchaRequired })
  const theme = getTheme(themeMode)
  // const navigate = useNavigate()
  console.log(data)
  const {
    /*register,*/
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginShema),
    defaultValues: { password: "c2606317", email: "a.barai6003@gmail.com", rememberMe: false },
  })
  const onSubmit = (data: LoginInputs) => {
    login(data)
      .unwrap()
      .then((res) => {
        if (res.resultCode === ResultCode.Success) {
          localStorage.setItem(AUTH_TOKEN, res.data.token)
          dispatch(setIsLoggedIn({ isLoggedIn: true }))
          reset()
        }else {
          if (res.resultCode === ResultCode.CaptchaError){
            setIsCaptchaRequired(true)
          }
        }


        //  else {
        //   let message = res.messages.length > 0 ? res.messages[0] : 'Some error occurred'
        //   dispatch(setAppErrorAC({error: message}))
        // }
      })
  }

  //variant 3 всегда с санки приходит ЗАРЕЗОЛВЕННЫЙ промис поэтому всегда будем попадать в then даже если там будет кэтч в санке
  // Поэтому используем unwrap()
  //  const onSubmit1 = (data:LoginInputs) {
  //    dispatch(loginTC(data))
  //      .unwrap().
  //    then((res: any) =>{
  //      debugger
  // if (res.payload.isisLoggedIn) {
  //       navigate (Path.Main)
  // }
  //    }).catch((err: any) =>{
  //      debugger
  //    })
  // reset()
  //  }

  //variant 1
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigate(Path.Main)
  //   }
  // }, [isLoggedIn])

  //variant 2 the best
  // if (isLoggedIn) {
  //   return <Navigate to={Path.Main} />
  // }


  return (
    <Grid container justifyContent={"center"}>
      <FormControl>
        <FormLabel>
          <p>
            To login get registered
            <a
              style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
              href="https://social-network.samuraijs.com"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>
            <b>Email:</b> free@samuraijs.com
          </p>
          <p>
            <b>Password:</b> free
          </p>
        </FormLabel>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            {/*<TextField error={!!errors.email} label="Email" margin="normal" {...register("email")} />*/}

            <Controller
              render={({ field }) => <TextField margin="normal" label="Email" error={!!errors.email} {...field} />}
              name="email"
              control={control}
            />
            {errors.email && <div className={s.errorMessage}>{errors.email.message}</div>}
            {/*<TextField*/}
            {/*  error={!!errors.password}*/}
            {/*  type="password"*/}
            {/*  label="Password"*/}
            {/*  margin="normal"*/}
            {/*  {...register("password")}*/}
            {/*/>*/}

            <Controller
              render={({ field }) => (
                <TextField margin="normal" label="Password" type="password" error={!!errors.password} {...field} />
              )}
              name="password"
              control={control}
            />

            {errors.password && <div className={s.errorMessage}>{errors.password.message}</div>}
            {isCaptchaRequired &&
              <>
                <Controller
                  render={({ field }) => (
                    <TextField margin="normal" label="Captcha" type="text" error={!!errors.captcha} {...field} />
                  )}
                  name="captcha"
                  control={control}
                />
                {errors.captcha && <div className={s.errorMessage}>{errors.captcha.message}</div>}

                <img src={data?.url} alt={'captcha'}>
                  Get Captcha
                </img>
              </>
          }

            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, ...rest } }) => <Checkbox checked={value} {...rest} />}
                />
              }
            />

            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  )
}
