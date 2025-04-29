import { z } from "zod";
import { newArticleSchema } from "./schema";

export type NewArticleData = z.infer<typeof newArticleSchema>;
