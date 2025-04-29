import { z } from "zod";
import { signInSchema } from "./schema";

export type SignInData = z.infer<typeof signInSchema>;
