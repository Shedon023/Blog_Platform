import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { SignUpData } from "../types";
import { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/store";
import { API_URL } from "@/shared/config/env";

export const useSignUp = (setError: UseFormSetError<SignUpData>) => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (userData: SignUpData) =>
      axios.post(`${API_URL}/users`, {
        user: {
          username: userData.userName,
          email: userData.emailAdress,
          password: userData.password,
        },
      }),
    onSuccess: (res) => {
      const user = res.data.user;
      setUser({
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image,
        token: user.token,
      });
      navigate("/", { replace: true });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 422) {
        setError("root", { message: "Username or email already taken" });
      } else {
        console.error("SignUp error", error);
        setError("root", { message: "Registration failed. Please try again." });
      }
    },
  });

  return {
    isLoading: mutation.isPending,
    signUpMutation: mutation.mutateAsync,
    isError: mutation.isError,
  };
};
