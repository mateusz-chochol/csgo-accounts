import { User } from "../types";

export const getUsersNamesFromIds = (userIds: string[], users: User[]) => {
  const userNames = userIds
    .map((userId) => users.find((user) => user.id === userId)?.displayName)
    .filter((userName) => !!userName);

  if (!userNames.length) {
    return "";
  }

  if (userNames.length === 1) {
    return userNames[0];
  }

  if (userNames.length === 2) {
    return `${userNames[0]} i ${userNames[1]}`;
  }

  return (
    userNames.slice(0, userNames.length - 1).join(", ") +
    ` i ${userNames[userNames.length - 1]}`
  );
};
