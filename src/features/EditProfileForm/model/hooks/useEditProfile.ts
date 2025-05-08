import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { EditProfileData } from "../types";
import { useUserStore } from "@/entities/user/model/store";
import { API_URL } from "@/shared/config/env";

export const useEditProfile = () => {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (userData: EditProfileData) => {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/user`,
        {
          user: {
            email: userData.emailAdress || undefined,
            username: userData.userName || undefined,
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
