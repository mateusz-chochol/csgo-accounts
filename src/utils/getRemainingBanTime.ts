import {
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
  MS_PER_SECOND,
} from "../consts";
import { getBanUntilAsDate } from "./getBanUntilAsDate";
import { getTimePartDisplayString } from "./getTimePartDisplayString";
import { getTimePartSpelling } from "./getTimePartSpelling";

export const getRemainingBanTime = (banUntil: string | null) => {
  if (!banUntil) {
    return null;
  }

  const banDate = getBanUntilAsDate(banUntil);
  const currentDate = new Date();

  if (banDate <= currentDate) {
    return null;
  }

  const banDateUTC = Date.UTC(
    banDate.getFullYear(),
    banDate.getMonth(),
    banDate.getDate(),
    banDate.getHours(),
    banDate.getMinutes(),
    banDate.getSeconds()
  );
  const currentDateUTC = Date.UTC(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours(),
    currentDate.getMinutes(),
    currentDate.getSeconds()
  );

  const remainingBanTime = banDateUTC - currentDateUTC;

  const remainingBanTimeInDays = Math.floor(remainingBanTime / MS_PER_DAY);
  const remainingBanTimeInHours = Math.floor(
    (remainingBanTime - remainingBanTimeInDays * MS_PER_DAY) / MS_PER_HOUR
  );
  const remainingBanTimeInMinutes = Math.floor(
    (remainingBanTime -
      remainingBanTimeInDays * MS_PER_DAY -
      remainingBanTimeInHours * MS_PER_HOUR) /
      MS_PER_MINUTE
  );
  const remainingBanTimeInSeconds = Math.floor(
    (remainingBanTime -
      remainingBanTimeInDays * MS_PER_DAY -
      remainingBanTimeInHours * MS_PER_HOUR -
      remainingBanTimeInMinutes * MS_PER_MINUTE) /
      MS_PER_SECOND
  );

  const hours = getTimePartDisplayString(remainingBanTimeInHours);
  const minutes = getTimePartDisplayString(remainingBanTimeInMinutes);
  const seconds = getTimePartDisplayString(remainingBanTimeInSeconds);

  if (!remainingBanTimeInDays) {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${remainingBanTimeInDays} ${getTimePartSpelling(
    remainingBanTimeInDays,
    "day"
  )}, ${hours}:${minutes}:${seconds}`;
};
