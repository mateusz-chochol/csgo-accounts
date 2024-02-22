import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { daysOptions, defaultTime } from "../../consts";
import { getBanUntilDateString, mapDayOptionToNumberOfDays } from "../../utils";
import { banAccount } from "../../api/accountsApi";
import { SnackbarContext } from "../../contexts";

interface BanAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  accountDisplayName: string;
  accountOwnerId: string;
}

export const BanAccountDialog = ({
  isOpen,
  onClose,
  accountId,
  accountDisplayName,
  accountOwnerId,
}: BanAccountDialogProps) => {
  const [days, setDays] = useState(daysOptions[0]);
  const [time, setTime] = useState<Dayjs | null>(defaultTime);
  const { addSnackbar } = useContext(SnackbarContext);

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newBan: { accountId: string; banUntil: string }) => {
      return banAccount(newBan.accountId, newBan.banUntil);
    },
    onSuccess: (_, { banUntil }) => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", accountOwnerId],
      });
      addSnackbar(
        `Konto "${accountDisplayName}" zostało zbanowane do ${banUntil}.`
      );
    },
    onError: () => {
      addSnackbar("Coś poszło nie tak.", "error");
    },
  });

  const canBanAccount = useMemo(
    () => days !== daysOptions[0] || time?.unix() !== defaultTime.unix(),
    [days, time]
  );

  const onBanAccount = async () => {
    if (!canBanAccount) {
      return onClose();
    }

    const hours = time?.hour() || 0;
    const minutes = time?.minute() || 0;
    const seconds = time?.second() || 0;

    await mutateAsync({
      accountId,
      banUntil: getBanUntilDateString(
        mapDayOptionToNumberOfDays(days),
        hours,
        minutes,
        seconds
      ),
    });

    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      const timeoutId = setTimeout(() => {
        setDays(daysOptions[0]);
        setTime(defaultTime);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        Banowanie konta <strong>{accountDisplayName}</strong>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={4}>
              <InputLabel id="days-select">Dni</InputLabel>
              <Select
                labelId="days-select"
                id="days-select"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                input={<OutlinedInput label="Dni" fullWidth />}
                disabled={isLoading}
              >
                {daysOptions.map((dayOption) => (
                  <MenuItem key={dayOption} value={dayOption}>
                    {dayOption}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={8} paddingTop={"26px"}>
              <TimePicker
                label="Godziny, minuty, sekundy"
                views={["hours", "minutes", "seconds"]}
                defaultValue={time}
                onChange={(newTime) => setTime(newTime)}
                ampm={false}
                disabled={isLoading}
              />
            </Grid>
          </Grid>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Zamknij
        </Button>
        <Button
          onClick={onBanAccount}
          variant="contained"
          color="error"
          disabled={!canBanAccount || isLoading}
        >
          Zbanuj konto
        </Button>
        {isLoading && <CircularProgress size={24} />}
      </DialogActions>
    </Dialog>
  );
};
