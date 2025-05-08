import { useQuery } from "@tanstack/react-query";
import { fetchArticle } from "@/shared/api/article-api";
import { AxiosError } from "axios";
import { ArticleType } from "@/pages/ArticleList/model/types";

export const useArticleBySlug = (slug: string | undefined, enabled: boolean) => {
  return useQuery<ArticleType, AxiosError>({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug!),
    enabled: enabled && !!slug,
  });
};
