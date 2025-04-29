import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UseFormReset } from "react-hook-form";
import { NewArticleData } from "../types";
import { useUserStore } from "@/entities/user/model/store";
import { useNavigate } from "react-router-dom";

export const useNewArticle = (reset: UseFormReset<NewArticleData>) => {
  const navigate = useNavigate();

  const token = useUserStore((state) => state.user?.token);

  const { mutate } = useMutation({
    mutationFn: (articleData: NewArticleData) =>
      axios.post(
        "https://blog-platform.kata.academy/api/articles",
        {
          article: {
            title: articleData.title,
            description: articleData.description,
            body: articleData.body,
            tagList: articleData.tagList,
          },
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      ),
    onSuccess: () => {
      console.log("Статья создана");
      navigate("/", { replace: true });
      reset();
    },
    onError: (error) => {
      console.error("Ошибка при создании статьи", error);
    },
  });

  return { mutate };
};
