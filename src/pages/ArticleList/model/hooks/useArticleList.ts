import { $ARTICLE_SERVICE } from "@/shared/api/services/article.service";

import { useQuery } from "@tanstack/react-query";

export const useArticleList = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["articles", { page }],
    queryFn: () => $ARTICLE_SERVICE.getAll(page, limit),
    refetchOnWindowFocus: false,
    //  keepPreviousData: true,
  });
};
