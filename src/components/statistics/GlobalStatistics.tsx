import React, { useState } from "react";
import {
  AccordionDetails,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { User } from "../../types";
import { useLastGameStats, useTotalGamesStats } from "../../hooks";
import {
  AccordionWithNoBackground,
  AccordionSummaryWithCloserIcon,
} from "../restyledMuiComponents";
import { AddGameStatsDialog } from "./AddGameStatsDialog";
import { BansAndKicksStats } from "./BansAndKicksStats";
import { GamesHistory } from "./GamesHistory";

interface GlobalStatisticsProps {
  users: User[];
}

export const GlobalStatistics = ({ users }: GlobalStatisticsProps) => {
  const [isAddGameStatsDialogOpen, setIsAddGameStatsDialogOpen] =
    useState(false);

  const { isLoading: areLastGameStatsLoading } = useLastGameStats();
  const { totalGamesStats, isLoading: isTotalGamesStatsLoading } =
    useTotalGamesStats();

  if (areLastGameStatsLoading || isTotalGamesStatsLoading) {
    return (
      <Box
        width={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="5rem"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!users.length || !totalGamesStats) {
    return null;
  }

  return (
    <Grid item xs={12} display="flex" justifyContent="space-between">
      <Box width="100%" padding={2}>
        <AccordionWithNoBackground>
          <AccordionSummaryWithCloserIcon expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" align="center">
              Statystyki
            </Typography>
          </AccordionSummaryWithCloserIcon>
          <AccordionDetails>
            <Grid
              container
              display="flex"
              justifyContent="space-between"
              spacing={1}
            >
              <Grid item xs={12}>
                <BansAndKicksStats
                  totalGamesStats={totalGamesStats}
                  users={users}
                />
              </Grid>
              <Grid item xs={12}>
                <GamesHistory users={users} totalGamesStats={totalGamesStats} />
              </Grid>
              <Grid item xs={12} marginTop={2}>
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => setIsAddGameStatsDialogOpen(true)}
                >
                  Dodaj statystyki z gry
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </AccordionWithNoBackground>
        <AddGameStatsDialog
          isOpen={isAddGameStatsDialogOpen}
          onClose={() => setIsAddGameStatsDialogOpen(false)}
          users={users}
          totalGamesStats={totalGamesStats}
        />
        <Box padding={1}>
          <Divider orientation="horizontal" />
        </Box>
      </Box>
    </Grid>
  );
};
