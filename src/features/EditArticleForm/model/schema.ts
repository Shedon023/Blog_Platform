import { z } from "zod";

export const editArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(30, "Not that much").optional(),
  description: z.string().min(1, "Description is required").max(30, "Not that much").optional(),
  body: z.string().min(1, "Text is required").optional(),
  tagList: z.array(z.string()).optional(),
});
