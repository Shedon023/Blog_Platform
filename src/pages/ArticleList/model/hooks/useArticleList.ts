import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchArticles = async (page: number, limit: number) => {
  const res = await axios.get(
    `https://blog-platform.kata.academy/api/articles?limit=${limit}&offset=${(page - 1) * limit}`
  );

  return res.data;
};

export const useArticleList = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["articles", { page }],
    queryFn: () => fetchArticles(page, limit),
    refetchOnWindowFocus: false,
    //  keepPreviousData: true,
  });
};
