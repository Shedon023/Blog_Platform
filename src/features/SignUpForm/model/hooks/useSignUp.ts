import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UseFormReset } from "react-hook-form";
import { SignUpData } from "../types";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/store";

export const useSignUp = (reset: UseFormReset<SignUpData>) => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (userData: SignUpData) =>
      axios.post("https://blog-platform.kata.academy/api/users", {
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

      console.log("Registration successful!");
      reset();
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("SignUp error", error);
    },
  });
  return { mutate };
};
