import { API_URL } from "@/shared/config/env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUser = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  return res.data.user;
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  });
};
