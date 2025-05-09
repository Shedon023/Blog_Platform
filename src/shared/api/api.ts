import { useUserStore } from "@/entities/user/model/store";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API_URL;

export const $AXIOS = axios.create({ baseURL });
axios.interceptors.request.use(
  function (config) {
    const token = useUserStore.getState().getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
