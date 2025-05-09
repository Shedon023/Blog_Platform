import { API_URL } from "@/shared/config/env";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export const useDeleteArticle = () => {
  const navigate = useNavigate();

  const { mutate: deleteArticle } = useMutation<AxiosResponse, Error, string>({
    mutationFn: async (slug: string) => {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${API_URL}/articles/${slug}`, {
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

  return {
    deleteArticle,
  };
};
