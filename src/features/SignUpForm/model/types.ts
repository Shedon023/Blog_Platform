import { z } from "zod";
import { signUpSchema } from "./schema";

export type SignUpData = z.infer<typeof signUpSchema>;

export type UserResponse = {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
  };
};
