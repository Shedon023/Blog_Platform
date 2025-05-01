import { z } from "zod";

export const editProfileSchema = z.object({
  userName: z.string().optional(),
  emailAdress: z.string().optional(),
  newPassword: z.string().optional(),
  avatarImage: z.string().optional(),
});
