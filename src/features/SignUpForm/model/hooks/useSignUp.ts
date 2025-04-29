import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UseFormReset } from "react-hook-form";
import { SignUpData } from "../types";

export const useSignUp = (reset: UseFormReset<SignUpData>) => {
  const { mutate } = useMutation({
    mutationFn: (userData: SignUpData) =>
      axios.post("https://blog-platform.kata.academy/api/users", {
        user: {
          username: userData.userName,
          email: userData.emailAdress,
          password: userData.password,
        },
      }),
    onSuccess: () => {
      console.log("Registration successful!");
      reset();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return { mutate };
};
