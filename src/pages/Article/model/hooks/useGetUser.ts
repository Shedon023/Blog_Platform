import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUser = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`https://blog-platform.kata.academy/api/user`, {
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
