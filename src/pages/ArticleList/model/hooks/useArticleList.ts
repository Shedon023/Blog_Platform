import { API_URL } from "@/shared/config/env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchArticles = async (page: number, limit: number) => {
  const res = await axios.get(`${API_URL}/articles?limit=${limit}&offset=${(page - 1) * limit}`);

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
