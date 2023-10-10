import { daysOptions } from "../consts";

export const mapDayOptionToNumberOfDays = (selectedOption: string) => {
  switch (selectedOption) {
    case daysOptions[0]:
      return 0;
    case daysOptions[1]:
      return 1;
    case daysOptions[2]:
      return 2;
    case daysOptions[3]:
      return 3;
    case daysOptions[4]:
      return 4;
    case daysOptions[5]:
      return 5;
    case daysOptions[6]:
      return 6;
    case daysOptions[7]:
      return 7;
    case daysOptions[8]:
      return 8;
    case daysOptions[9]:
      return 9;
    case daysOptions[10]:
      return 10;
    case daysOptions[11]:
      return 11;
    case daysOptions[12]:
      return 12;
    case daysOptions[13]:
      return 13;
    case daysOptions[14]:
      return 14;
    default:
      return 0;
  }
};
