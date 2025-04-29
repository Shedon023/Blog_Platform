import { z } from "zod";
import { editProfileSchema } from "./schema";

export type EditProfileData = z.infer<typeof editProfileSchema>;
