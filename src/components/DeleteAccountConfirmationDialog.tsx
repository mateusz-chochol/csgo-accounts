import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { deleteAccount } from "../api/accountsApi";

interface DeleteAccountConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountDisplayName: string;
  accountOwnerId: string;
}

export const DeleteAccountConfirmationDialog = ({
  isOpen,
  onClose,
  accountDisplayName,
  accountId,
  accountOwnerId,
}: DeleteAccountConfirmationDialogProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (accountId: string) => {
      return deleteAccount(accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountOwnerId],
      });
    },
  });

  const onDeleteAccount = async () => {
    await mutateAsync(accountId);

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Usuwanie konta</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć konto <strong>{accountDisplayName}</strong>
          ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Zamknij
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onDeleteAccount}
          disabled={isLoading}
        >
          Usuń konto
        </Button>
        {isLoading && <CircularProgress size={24} />}
      </DialogActions>
    </Dialog>
  );
};
