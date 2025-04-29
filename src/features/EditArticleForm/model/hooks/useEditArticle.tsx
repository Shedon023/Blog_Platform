import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { UseFormReset } from "react-hook-form";
import { EditArticleData, EditArticlePayload } from "../types";
import { useNavigate } from "react-router-dom";

export const useEditArticle = (reset: UseFormReset<EditArticleData>) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ slug, data }: EditArticlePayload) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      const response = await axios.put(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
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
        navigate(`/articles/${data.article.slug}`);
      }

      reset();
    },
    onError: (error: AxiosError) => {
      console.error("Ошибка при редактировании статьи", error);
    },
  });
};
