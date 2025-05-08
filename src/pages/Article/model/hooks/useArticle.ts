import { API_URL } from "@/shared/config/env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchArticle = async (slug: string) => {
  const res = await axios.get(`${API_URL}/articles/${slug}`);

  return res.data.article;
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug),
    enabled: !!slug,
  });
};
