export const getBanUntilDateString = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number
): string => {
  const currentDate = new Date();

  const banUntilDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + days,
    currentDate.getHours() + hours,
    currentDate.getMinutes() + minutes,
    currentDate.getSeconds() + seconds
  );

  return banUntilDate.toLocaleString("pl-PL");
};
