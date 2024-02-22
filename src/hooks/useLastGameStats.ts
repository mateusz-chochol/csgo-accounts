import { useQuery } from "react-query";
import { fetchLastGameStats } from "../api/gamesStatsApi";

export const useLastGameStats = () => {
  const { data, status } = useQuery("lastGameStats", () =>
    fetchLastGameStats()
  );

  return {
    lastGameStats: data,
    isLoading: status === "loading",
  };
};
