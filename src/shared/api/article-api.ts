import axios from "axios";
import { API_URL } from "../config/env";

export const fetchArticle = async (slug: string) => {
  const res = await axios.get(`${API_URL}/articles/${slug}`);
  return res.data.article;
};
