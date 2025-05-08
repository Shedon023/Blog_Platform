import { API_URL } from "@/shared/config/env";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useFavorite = () => {
  const token = localStorage.getItem("token");

  const favorite = async (slug: string) => {
    const res = await axios.post(
      `${API_URL}/articles/${slug}/favorite`,
      {},
      { headers: { Authorization: `Token ${token}` } }
    );

    return res.data;
  };

  return useMutation({
    mutationFn: (slug: string) => favorite(slug),
  });
};
