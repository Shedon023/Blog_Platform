import { z } from "zod";

export const signInSchema = z.object({
  emailAdress: z.string().email("Invalid email"),
  password: z.string().min(1, "Invalid password"),
});
