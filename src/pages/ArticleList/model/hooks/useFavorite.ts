import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useFavorite = () => {
  const token = localStorage.getItem("token");

  const favorite = async (slug: string) => {
    const res = await axios.post(
      `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
      {},
      { headers: { Authorization: `Token ${token}` } }
    );

    return res.data;
  };

  return useMutation({
    mutationFn: (slug: string) => favorite(slug),
  });
};
