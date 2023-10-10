export const getTimePartSpelling = (
  timePart: number,
  timePartType: "day" | "hour" | "minute" | "second"
) => {
  switch (timePartType) {
    case "day":
      if (timePart === 1) {
        return "dzień";
      }

      return "dni";
    case "hour":
      if (timePart === 1) {
        return "godzinę";
      }

      if (timePart % 100 > 11 && timePart % 100 < 15) {
        return "godzin";
      }

      if (timePart % 10 > 1 && timePart % 10 < 5) {
        return "godziny";
      }

      return "godzin";
    case "minute":
      if (timePart === 1) {
        return "minutę";
      }

      if (timePart % 100 > 11 && timePart % 100 < 15) {
        return "minut";
      }

      if (timePart % 10 > 1 && timePart % 10 < 5) {
        return "minuty";
      }

      return "minut";
    case "second":
      if (timePart === 1) {
        return "sekundę";
      }

      if (timePart % 100 > 11 && timePart % 100 < 15) {
        return "sekund";
      }

      if (timePart % 10 > 1 && timePart % 10 < 5) {
        return "sekundy";
      }

      return "sekund";
    default:
      return "";
  }
};
