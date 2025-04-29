import { z } from "zod";

export const editProfileSchema = z.object({
  userName: z.string().min(1, ""),
  emailAdress: z.string().email(""),
  newPassword: z.string().min(6, ""),
  avatarImage: z.string(),
});
