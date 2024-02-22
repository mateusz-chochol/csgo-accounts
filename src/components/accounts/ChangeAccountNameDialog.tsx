import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { changeAccountName } from "../../api/accountsApi";
import { SnackbarContext } from "../../contexts";

interface ChangeAccountNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountDisplayName: string;
  accountOwnerId: string;
}

export const ChangeAccountNameDialog = ({
  isOpen,
  onClose,
  accountDisplayName,
  accountId,
  accountOwnerId,
}: ChangeAccountNameDialogProps) => {
  const [newAccountName, setNewAccountName] = useState("");
  const { addSnackbar } = useContext(SnackbarContext);

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newName: { accountId: string; newAccountName: string }) => {
      return changeAccountName(newName.accountId, newName.newAccountName);
    },
    onSuccess: (_, { newAccountName }) => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountOwnerId],
      });
      addSnackbar(
        `Nazwa konta "${accountDisplayName}" został zmieniona na "${newAccountName}".`,
        "info"
      );
    },
    onError: () => {
      addSnackbar("Coś poszło nie tak.", "error");
    },
  });

  const canChangeName = useMemo(
    () => newAccountName !== "" && newAccountName !== accountDisplayName,
    [newAccountName, accountDisplayName]
  );

  const onChangeAccountName = async () => {
    if (!canChangeName) {
      return onClose();
    }

    await mutateAsync({ accountId, newAccountName });

    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      const timeoutId = setTimeout(() => {
        setNewAccountName("");
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Zmiana nazwy konta</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Aktualna nazwa konta to <strong>{accountDisplayName}</strong>.
          Wprowadź nową nazwę konta.
        </DialogContentText>
        <Box marginTop={3}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nazwa konta"
            fullWidth
            variant="standard"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            disabled={isLoading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Zamknij
        </Button>
        <Button
          onClick={onChangeAccountName}
          variant="contained"
          disabled={!canChangeName || isLoading}
        >
          Zmień
        </Button>
        {isLoading && <CircularProgress size={24} />}
      </DialogActions>
    </Dialog>
  );
};
