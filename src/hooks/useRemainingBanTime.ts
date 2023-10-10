import { useEffect, useState } from "react";
import { MS_PER_SECOND } from "../consts";
import { getRemainingBanTime } from "../utils";
import { useQueryClient } from "react-query";

export const useRemainingBanTime = (
  banUntil: string | null,
  ownerId: string
) => {
  const [remainingBanTime, setRemainingBanTime] = useState(
    getRemainingBanTime(banUntil)
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (remainingBanTime) {
      const intervalId = setInterval(() => {
        const remainingBan = getRemainingBanTime(banUntil);
        setRemainingBanTime(remainingBan);

        if (!remainingBan) {
          queryClient.invalidateQueries({
            queryKey: ["accounts", ownerId],
          });
        }
      }, MS_PER_SECOND);

      return () => clearInterval(intervalId);
    }
  }, [banUntil, queryClient, remainingBanTime, ownerId]);

  return remainingBanTime;
};
