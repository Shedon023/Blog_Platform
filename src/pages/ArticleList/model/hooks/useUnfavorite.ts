import { API_URL } from "@/shared/config/env";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUnfavorite = () => {
  const token = localStorage.getItem("token");

  const unFavorite = async (slug: string) => {
    const res = await axios.delete(`${API_URL}/articles/${slug}/favorite`, {
      headers: { Authorization: `Token ${token}` },
    });

    return res.data;
  };

  return useMutation({
    mutationFn: (slug: string) => unFavorite(slug),
  });
};
