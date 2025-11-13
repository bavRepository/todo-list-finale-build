import { baseResponseSchema } from "@/common/types"
import * as z from "zod"


export const authOperationResponseSchema = baseResponseSchema(
  z.object({
    userId: z.number(),
    token: z.string(),
  }),
)

export const authMeResponseSchema = baseResponseSchema(
  z.union([
    z.object({
      id: z.number(),
      email: z.email(),
      login: z.string(),
    }),
    z.object({}),
  ]),
)

export const captchaResponseSchema = (
  z.object({
  url: z.string(),
  })
)

export type getCaptchaResponse = z.infer<typeof captchaResponseSchema>
export type authMeResponse = z.infer<typeof authMeResponseSchema>
export type authOperationResponse = z.infer<typeof authOperationResponseSchema>
