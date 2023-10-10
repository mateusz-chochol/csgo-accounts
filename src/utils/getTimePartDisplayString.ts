export const getTimePartDisplayString = (timePart: number) => {
  return timePart.toString().padStart(2, "0");
};
