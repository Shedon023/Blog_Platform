import axios from "axios";

export const fetchArticle = async (slug: string) => {
  const res = await axios.get(`https://blog-platform.kata.academy/api/articles/${slug}`);
  return res.data.article;
};
