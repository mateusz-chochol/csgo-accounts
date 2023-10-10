import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { AccountCard } from "./AccountCard";
import { useOwnerAccounts } from "../hooks";
import { AddAccountDialog } from "./AddAccountDialog";

interface AccountStackProps {
  ownerId: string;
  ownerDisplayName: string;
}

export const AccountStack = ({
  ownerId,
  ownerDisplayName,
}: AccountStackProps) => {
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);

  const { accounts, isLoading } = useOwnerAccounts(ownerId);

  if (isLoading) {
    return (
      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box display="flex" width="100%" flexDirection="column">
      <Typography variant="h4" align="center">
        {ownerDisplayName}
        {" | "}
        {accounts.filter((account) => !account.banUntil).length}/
        {accounts.length}
      </Typography>
      <Box display="flex">
        <Stack spacing={2} mt={2} width="100%">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              id={account.id}
              displayName={account.displayName}
              banUntil={account.banUntil}
              banCounter={account.banCounter}
              totalBanTime={account.totalBanTime}
              lastBanTime={account.lastBanTime}
              ownerId={ownerId}
            />
          ))}
        </Stack>
      </Box>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button color="success" onClick={() => setIsAddAccountDialogOpen(true)}>
          Dodaj konto
        </Button>
      </Box>
      <AddAccountDialog
        isOpen={isAddAccountDialogOpen}
        onClose={() => setIsAddAccountDialogOpen(false)}
        accountOwnerId={ownerId}
      />
    </Box>
  );
};
