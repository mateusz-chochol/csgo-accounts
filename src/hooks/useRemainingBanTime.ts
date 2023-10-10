import { useEffect, useState } from "react";
import { MS_PER_SECOND } from "../consts";
import { getRemainingBanTime } from "../utils";

export const useRemainingBanTime = (banUntil: string | null) => {
  const [remainingBanTime, setRemainingBanTime] = useState(
    getRemainingBanTime(banUntil)
  );

  useEffect(() => {
    const intervalId = setInterval(
      () => setRemainingBanTime(getRemainingBanTime(banUntil)),
      MS_PER_SECOND
    );

    return () => clearInterval(intervalId);
  }, [banUntil]);

  return remainingBanTime;
};
