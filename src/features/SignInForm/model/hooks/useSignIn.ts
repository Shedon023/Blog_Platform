import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { SignInData } from "../types";
import { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const useSignIn = (
  setError: UseFormSetError<{
    emailAdress: string;
    password: string;
  }>
) => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (userData: SignInData) =>
      axios.post("https://blog-platform.kata.academy/api/users/login", {
        user: {
          email: userData.emailAdress,
          password: userData.password,
        },
      }),
    onSuccess: (res) => {
      console.log("Loggining successful!");
      const token = res.data.user.token;
      localStorage.setItem("authToken", token);
      navigate("/", { replace: true });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 422 || error.response?.status === 401) {
        setError("root", { message: "Неверный логин или пароль" });
      } else {
        console.log(error);
      }
    },
  });

  return { isLoading: mutation.isPending, loginMutation: mutation.mutateAsync, isError: mutation.isError };
};
