export const getBanUntilAsDate = (banUntil: string): Date => {
  const [date, time] = banUntil.split(",");
  const [day, month, year] = date.split(".");

  const banUntilConvertedToCorrectFormat = `${month}/${day}/${year}, ${time}`;

  return new Date(banUntilConvertedToCorrectFormat);
};
