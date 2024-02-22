import { useQuery } from "react-query";
import { fetchGamesStats } from "../api/gamesStatsApi";

export const useGamesStats = (shouldDownloadGamesStats: boolean) => {
  const { data, status } = useQuery("gamesStats", () => fetchGamesStats(), {
    enabled: shouldDownloadGamesStats,
  });

  return {
    gamesStats: data || [],
    isLoading: status === "loading",
  };
};
