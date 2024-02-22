import React, { useContext } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { SnackbarContext } from "../../contexts";
import { GameStats, TotalGamesStats, User } from "../../types";
import { deleteGameStats } from "../../api/gamesStatsApi";
import { getUsersNamesFromIds } from "../../utils";

interface DeleteGameStatsConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gameStats: GameStats | null;
  users: User[];
  totalGamesStats: TotalGamesStats;
}

export const DeleteGameStatsConfirmationDialog = ({
  isOpen,
  onClose,
  gameStats,
  users,
  totalGamesStats,
}: DeleteGameStatsConfirmationDialogProps) => {
  const queryClient = useQueryClient();
  const { addSnackbar } = useContext(SnackbarContext);

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (gameStats: GameStats) => {
      return deleteGameStats(
        gameStats.id,
        gameStats.kicks,
        gameStats.bans,
        gameStats.usersInvolved,
        users,
        totalGamesStats
      );
    },
    onSuccess: () => {
      if (!gameStats) {
        return;
      }

      const queriesToInvalidate = [
        "users",
        "gamesStats",
        "lastGameStats",
        "totalGamesStats",
      ] as const;

      queriesToInvalidate.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey })
      );

      addSnackbar(`Dane o grze z dnia "${gameStats.date}" zostały usunięte.`);
    },
    onError: () => {
      addSnackbar("Coś poszło nie tak.", "error");
    },
  });

  const onDeleteGameStats = async () => {
    if (!gameStats) {
      return;
    }

    await mutateAsync(gameStats);

    onClose();
  };

  if (!gameStats) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>Usuwanie wpisu o grze</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz informacje na temat statystyk z gry granej przez{" "}
          <strong>
            {getUsersNamesFromIds(gameStats.usersInvolved, users)}
          </strong>{" "}
          w dniu <strong>{gameStats.date}</strong>?
          <Box marginTop={1}>
            (zbanowanych: {gameStats.bans}, wykopanych: {gameStats.kicks})
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Zamknij
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onDeleteGameStats}
          disabled={isLoading}
        >
          Usuń dane o grze
        </Button>
        {isLoading && <CircularProgress size={24} />}
      </DialogActions>
    </Dialog>
  );
};
