import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUnfavorite = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token");

  const unFavorite = async (slug: string) => {
    const res = await axios.delete(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
      headers: { Authorization: `Token ${token}` },
    });

    return res.data;
  };

  return useMutation({
    mutationFn: (slug: string) => unFavorite(slug),
  });
};
