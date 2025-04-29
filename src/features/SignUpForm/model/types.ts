import { z } from "zod";
import { signUpSchema } from "./schema";

export type SignUpData = z.infer<typeof signUpSchema>;
