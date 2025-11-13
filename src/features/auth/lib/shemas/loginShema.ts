import * as z from "zod"

export const loginShema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required").min(3, "Min length must be at least 3 characters"),
  rememberMe: z.boolean(),
  captcha: z.string().optional(),
  // captcha: z.boolean().optional(),
})
