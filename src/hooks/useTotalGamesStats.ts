import { useQuery } from "react-query";
import { fetchTotalGamesStats } from "../api/totalGamesStats";

export const useTotalGamesStats = () => {
  const { data, status } = useQuery("totalGamesStats", () =>
    fetchTotalGamesStats()
  );

  return {
    totalGamesStats: data,
    isLoading: status === "loading",
  };
};
