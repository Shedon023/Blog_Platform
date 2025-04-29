import { z } from "zod";

export const editArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  body: z.string().min(1, "Text is required"),
  tagList: z.array(z.string()).optional(),
});
