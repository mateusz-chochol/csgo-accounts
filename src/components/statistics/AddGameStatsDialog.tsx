import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { addNewGameStats } from "../../api/gamesStatsApi";
import { SnackbarContext } from "../../contexts";
import { TotalGamesStats, User } from "../../types";
import { getUsersNamesFromIds } from "../../utils";
import { DATE_DISPLAY_FORMAT } from "../../consts";

interface AddGameStatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  totalGamesStats: TotalGamesStats;
}

export const AddGameStatsDialog = ({
  isOpen,
  onClose,
  users,
  totalGamesStats,
}: AddGameStatsDialogProps) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs(Date.now()));
  const [kicks, setKicks] = useState(0);
  const [bans, setBans] = useState(0);
  const [usersInvolved, setUsersInvolved] = useState<string[]>([]);
  const { addSnackbar } = useContext(SnackbarContext);

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newGameStats: {
      date: Dayjs;
      kicks: number;
      bans: number;
      usersInvolved: string[];
    }) => {
      const date = newGameStats.date.format(DATE_DISPLAY_FORMAT);
      const timestamp = newGameStats.date.toDate().getTime();

      return addNewGameStats(
        date,
        timestamp,
        newGameStats.kicks,
        newGameStats.bans,
        newGameStats.usersInvolved,
        users,
        totalGamesStats
      );
    },
    onSuccess: (_, { date }) => {
      const queriesToInvalidate = [
        "users",
        "gamesStats",
        "lastGameStats",
        "totalGamesStats",
      ] as const;

      queriesToInvalidate.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey })
      );

      addSnackbar(`Statystyki z gry z dnia ${date} zostały dodane.`);
    },
    onError: () => {
      addSnackbar("Coś poszło nie tak.", "error");
    },
  });

  const onAddGameStats = async () => {
    if (!date) {
      addSnackbar("Data jest wymagana.", "error");
      return;
    }

    if (!usersInvolved.length) {
      addSnackbar("Uczestnicy są wymagani.", "error");
      return;
    }

    if (usersInvolved.length > 5) {
      addSnackbar(
        "Nie da się grać w więcej niż 5 osób. Liczba uczesnitków jest niepoprawna.",
        "error"
      );
      return;
    }

    if (kicks + bans + usersInvolved.length > 5) {
      addSnackbar(
        `Nie da się zbanować i wykopać więcej niż ${
          5 - usersInvolved.length
        } graczy w jednej grze, przy ${usersInvolved.length} ${
          usersInvolved.length === 1 ? "uczestniku" : "uczestnikach"
        } gry.`,
        "error"
      );
      return;
    }

    await mutateAsync({ date, kicks, bans, usersInvolved });

    onClose();
  };

  const handleAddInvolvedUser = useCallback(
    (userIds: string | string[]) =>
      setUsersInvolved(
        typeof userIds === "string" ? userIds.split(",") : userIds
      ),
    []
  );

  useEffect(() => {
    if (!isOpen) {
      const timeoutId = setTimeout(() => {
        setDate(dayjs(Date.now()));
        setKicks(0);
        setBans(0);
        setUsersInvolved([]);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setDate(dayjs(Date.now()));
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>Dodawanie statystyk z nowej gry</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <DateTimePicker
                label="Data"
                ampm={false}
                value={date}
                onChange={(newDate) => setDate(newDate)}
                format={DATE_DISPLAY_FORMAT}
                disabled={isLoading}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="bans-select">Zbanowania</InputLabel>
              <Select
                labelId="bans-select"
                id="bans-select"
                value={bans}
                input={<OutlinedInput label="Zbanowania" fullWidth />}
                onChange={(e) => setBans(Number(e.target.value))}
                disabled={isLoading}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="kicks-select">Wykopania</InputLabel>
              <Select
                labelId="kicks-select"
                id="kicks-select"
                value={kicks}
                input={<OutlinedInput label="Wykopania" fullWidth />}
                onChange={(e) => setKicks(Number(e.target.value))}
                disabled={isLoading}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="users-involved-select">Uczestnicy</InputLabel>
              <Select
                labelId="users-involved-select"
                id="users-involved-select"
                value={usersInvolved}
                input={<OutlinedInput label="Uczestnicy" fullWidth />}
                renderValue={(userIds) => getUsersNamesFromIds(userIds, users)}
                onChange={(e) => handleAddInvolvedUser(e.target.value)}
                disabled={isLoading}
                multiple
              >
                <MenuItem disabled value="">
                  <em>Wybierz uczestników</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox checked={usersInvolved.includes(user.id)} />
                    <ListItemText primary={user.displayName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Zamknij
        </Button>
        <Button
          onClick={onAddGameStats}
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
