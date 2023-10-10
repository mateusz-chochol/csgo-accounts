import React, { useEffect, useState } from "react";
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
import { addNewAccount } from "../api/accountsApi";

interface AddAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountOwnerId: string;
}

export const AddAccountDialog = ({
  isOpen,
  onClose,
  accountOwnerId,
}: AddAccountDialogProps) => {
  const [newAccountName, setNewAccountName] = useState("");

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newAccount: { name: string; ownerId: string }) => {
      return addNewAccount(newAccount.name, newAccount.ownerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountOwnerId],
      });
    },
  });

  const onAddAccount = async () => {
    await mutateAsync({ name: newAccountName, ownerId: accountOwnerId });

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
      <DialogTitle>Dodawanie nowego konta</DialogTitle>
      <DialogContent>
        <DialogContentText>Wprowadź nazwę dla nowego konta.</DialogContentText>
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
          onClick={onAddAccount}
          variant="contained"
          color="success"
          disabled={isLoading}
        >
          Dodaj
        </Button>
        {isLoading && <CircularProgress size={24} />}
      </DialogActions>
    </Dialog>
  );
};
