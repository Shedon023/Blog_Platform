import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchArticle = async (slug: string) => {
  const res = await axios.get(`https://blog-platform.kata.academy/api/articles/${slug}`);

  return res.data.article;
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug),
    enabled: !!slug,
  });
};
