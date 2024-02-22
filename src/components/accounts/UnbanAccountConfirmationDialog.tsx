import React, { useContext } from "react";
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
import { unbanAccount } from "../../api/accountsApi";
import { SnackbarContext } from "../../contexts";

interface UnbanAccountConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountDisplayName: string;
  accountOwnerId: string;
}

export const UnbanAccountConfirmationDialog = ({
  isOpen,
  onClose,
  accountDisplayName,
  accountId,
  accountOwnerId,
}: UnbanAccountConfirmationDialogProps) => {
  const queryClient = useQueryClient();
  const { addSnackbar } = useContext(SnackbarContext);

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (accountId: string) => {
      return unbanAccount(accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountOwnerId],
      });
      addSnackbar(`Konto "${accountDisplayName}" zostało odbanowane.`, "info");
    },
    onError: () => {
      addSnackbar("Coś poszło nie tak.", "error");
    },
  });

  const onUnbanAccount = async () => {
    await mutateAsync(accountId);

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Odbanowanie konta</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz odbanować konto{" "}
          <strong>{accountDisplayName}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Zamknij
        </Button>
        <Button
          variant="contained"
          onClick={onUnbanAccount}
          disabled={isLoading}
        >
          Odbanuj konto
        </Button>
        {isLoading && <CircularProgress size={24} />}
      </DialogActions>
    </Dialog>
  );
};
