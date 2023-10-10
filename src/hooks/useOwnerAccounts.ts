import { useQuery } from "react-query";
import { fetchUserAccounts } from "../api/accountsApi";

export const useOwnerAccounts = (ownerId: string) => {
  const { data, status, isFetching } = useQuery(["accounts", ownerId], () =>
    fetchUserAccounts(ownerId)
  );

  return {
    accounts:
      data?.sort((a, b) => {
        if (a.banUntil && b.banUntil) {
          return a.banUntil.localeCompare(b.banUntil);
        }

        if (a.banUntil) {
          return -1;
        }

        if (b.banUntil) {
          return 1;
        }

        return a.displayName.localeCompare(b.displayName);
      }) || [],
    isLoading: status === "loading" || isFetching,
  };
};
