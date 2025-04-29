import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { EditProfileData } from "../types";
import { useUserStore } from "@/entities/user/model/store";

export const useEditProfile = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (userData: EditProfileData) => {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "https://blog-platform.kata.academy/api/user",
        {
          user: {
            email: userData.emailAdress,
            username: userData.userName,
            password: userData.newPassword || undefined,
            image: userData.avatarImage,
          },
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      return response.data.user;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    },
    onError: (error: AxiosError) => {
      console.error("Ошибка при обновлении профиля", error);
    },
  });
};
