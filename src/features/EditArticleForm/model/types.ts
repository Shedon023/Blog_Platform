import { z } from "zod";
import { editArticleSchema } from "./schema";

export type EditArticleData = z.infer<typeof editArticleSchema>;
export type EditArticlePayload = {
  slug: string;
  data: EditArticleData;
};
