import { useQuery } from "react-query";
import { fetchUserAccounts } from "../api/accountsApi";
import { getBanUntilAsDate } from "../utils";

export const useOwnerAccounts = (ownerId: string) => {
  const { data, status, isFetching } = useQuery(["accounts", ownerId], () =>
    fetchUserAccounts(ownerId)
  );

  return {
    accounts:
      data
        ?.map((account) => {
          if (!account.banUntil) {
            return account;
          }

          const banUntilAsDate = getBanUntilAsDate(account.banUntil);
          const currentDate = new Date();
          const isBanDateInPast = banUntilAsDate < currentDate;

          if (isBanDateInPast) {
            return {
              ...account,
              banUntil: null,
            };
          }

          return account;
        })
        .sort((a, b) => {
          if (a.banUntil) {
            return 1;
          }

          if (b.banUntil) {
            return -1;
          }

          return a.displayName.localeCompare(b.displayName);
        }) || [],
    isLoading: status === "loading" || isFetching,
  };
};
