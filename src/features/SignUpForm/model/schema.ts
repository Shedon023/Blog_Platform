import { z } from "zod";

export const signUpSchema = z
  .object({
    userName: z.string().min(1, "Username is required"),
    emailAdress: z.string().email("Invalid email"),
    password: z.string().min(6, "Your password needs to be at least 6 characters"),
    repeatPassword: z.string().min(1, "Password confirmation is required"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms" }),
    }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match",
    path: ["repeatPassword"],
  });
