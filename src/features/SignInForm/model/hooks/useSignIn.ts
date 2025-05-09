import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { SignInData } from "../types";
import { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/shared/config/env";

export const useSignIn = (setError: UseFormSetError<SignInData>) => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (userData: SignInData) =>
      axios.post(`${API_URL}/users/login`, {
        user: {
          email: userData.email,
          password: userData.password,
        },
      }),
    onSuccess: (res) => {
      console.log("Loggining successful!");
      const token = res.data.user.token;
      localStorage.setItem("authToken", token);
      navigate("/", { replace: true });
      console.log("You are logged in!");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 422 || error.response?.status === 401) {
        setError("root", { message: "Invalid email or password" });
      } else {
        console.log(error);
      }
    },
  });

  return { isLoading: mutation.isPending, loginMutation: mutation.mutateAsync, isError: mutation.isError };
};
