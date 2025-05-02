import { z } from "zod";

export const newArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(30, "Max 30 characters"),
  description: z.string().min(1, "Description is required").max(30, "Max 30 characters"),
  body: z.string().min(1, "Text is required"),
  tagList: z.array(z.string()).optional(),
});
