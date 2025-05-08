import { EditArticleData, NewArticleData } from "./schema";

export type ArticleFormData = NewArticleData | EditArticleData;

export type EditArticlePayload = {
  slug: string;
  data: ArticleFormData;
};

export type SlugProp = {
  slug: string | undefined;
};

export type ArticleFormProps = {
  mode: "create" | "edit";
  defaultValues?: ArticleFormData;
  slug: string | undefined;
};
