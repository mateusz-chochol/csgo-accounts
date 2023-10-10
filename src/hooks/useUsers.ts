import { useQuery } from "react-query";
import { fetchUsers } from "../api/usersApi";

export const useUsers = () => {
  const { data, status } = useQuery("users", () => fetchUsers());

  return {
    users: data || [],
    isLoading: status === "loading",
  };
};
