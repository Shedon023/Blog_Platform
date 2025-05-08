import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArticleFormData } from "../types";
import { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/store";
import { API_URL } from "@/shared/config/env";

export const useNewArticle = (setError: UseFormSetError<ArticleFormData>) => {
  const navigate = useNavigate();
  const token = useUserStore((state) => state.user?.token);

  const mutation = useMutation({
    mutationFn: (articleData: ArticleFormData) =>
      axios.post(
        `${API_URL}/articles`,
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
      navigate("/", { replace: true });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 422) {
        setError("root", { message: "Validation failed. Please check your inputs." });
      } else if (error.response?.status === 401) {
        setError("root", { message: "You need to be logged in to create an article" });
      } else {
        setError("root", { message: "Failed to create article. Please try again." });
        console.error("Article creation error", error);
      }
    },
  });

  return {
    isLoading: mutation.isPending,
    createArticle: mutation.mutateAsync,
    isError: mutation.isError,
  };
};
