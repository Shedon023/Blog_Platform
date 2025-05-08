import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { EditArticlePayload } from "../types";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/shared/config/env";

export const useEditArticle = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ slug, data }: EditArticlePayload) => {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/articles/${slug}`,
        {
          article: {
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: data.tagList,
          },
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Статья отредактирована");

      if (data && data.article && data.article.slug) {
        navigate(`/article/${data.article.slug}`);
      }
    },
    onError: (error: AxiosError) => {
      console.error("Ошибка при редактировании статьи", error);
    },
  });
};
