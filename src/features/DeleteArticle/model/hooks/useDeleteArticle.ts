import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export const useDeleteArticle = () => {
  const navigate = useNavigate();

  return useMutation<AxiosResponse, Error, string>({
    mutationFn: async (slug: string) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      const response = await axios.delete(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      return response;
    },

    onSuccess: () => {
      console.log("Статья удалена");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("Ошибка при удалении статьи", error.message);
    },
  });
};
