import { z } from "zod";

export const newArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(30, "Not that much"),
  description: z.string().min(1, "Description is required").max(30, "Not that much"),
  body: z.string().min(1, "Text is required"),
  tagList: z.array(z.string()).optional(),
});
