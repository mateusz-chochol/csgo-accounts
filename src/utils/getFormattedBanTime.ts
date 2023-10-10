import {
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
  MS_PER_SECOND,
} from "../consts";
import { getTimePartSpelling } from "./getTimePartSpelling";

export const getFormattedBanTime = (banTime: number) => {
  const banTimeInMS = banTime * MS_PER_SECOND;

  const days = Math.floor(banTimeInMS / MS_PER_DAY);
  let remainingTime = banTimeInMS - days * MS_PER_DAY;

  const hours = Math.floor(remainingTime / MS_PER_HOUR);
  remainingTime = remainingTime - hours * MS_PER_HOUR;

  const minutes = Math.floor(remainingTime / MS_PER_MINUTE);
  remainingTime = remainingTime - minutes * MS_PER_MINUTE;

  const seconds = Math.floor(remainingTime / MS_PER_SECOND);

  const formattedBanTimeStringParts = [
    days ? `${days} ${getTimePartSpelling(days, "day")}` : "",
    hours ? `${hours} ${getTimePartSpelling(hours, "hour")}` : "",
    minutes ? `${minutes} ${getTimePartSpelling(minutes, "minute")}` : "",
    seconds ? `${seconds} ${getTimePartSpelling(seconds, "second")}` : "",
  ];

  const formattedBanTimeString = formattedBanTimeStringParts
    .filter(Boolean)
    .join(", ");

  return formattedBanTimeString;
};
