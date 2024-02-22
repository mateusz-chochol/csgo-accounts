import React, { useCallback, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGamesStats, useLastGameStats } from "../../hooks";
import { GameStats, TotalGamesStats, User } from "../../types";
import {
  ListSubheaderWithNoBackground,
  PaperWithNoBackground,
} from "../restyledMuiComponents";
import { DeleteGameStatsConfirmationDialog } from "./DeleteGameStatsConfirmationDialog";

interface GamesHistoryProps {
  users: User[];
  totalGamesStats: TotalGamesStats;
}

export const GamesHistory = ({ users, totalGamesStats }: GamesHistoryProps) => {
  const theme = useTheme();
  const isAtLeastLargeSizeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [isDeleteGameStatsDialogOpen, setIsDeleteGameStatsDialogOpen] =
    useState(false);
  const [gameStatsToDelete, setGameStatsToDelete] = useState<GameStats | null>(
    null
  );
  const [hasGamesHistoryBeenExpanded, setHasGamesHistoryBeenExpanded] =
    useState(false);
  const [isGamesStatsHistoryExpanded, setIsGamesStatsHistoryExpanded] =
    useState(false);

  const { lastGameStats } = useLastGameStats();
  const { gamesStats, isLoading: areGamesStatsLoading } = useGamesStats(
    hasGamesHistoryBeenExpanded
  );

  const onGamesStatsHistoryExpand = useCallback(() => {
    if (!hasGamesHistoryBeenExpanded) {
      setHasGamesHistoryBeenExpanded(true);
    }

    setIsGamesStatsHistoryExpanded((state) => !state);
  }, [hasGamesHistoryBeenExpanded]);

  const handleCloseDeleteGameStatsDialog = useCallback(() => {
    setIsDeleteGameStatsDialogOpen(false);
    setGameStatsToDelete(null);
  }, []);

  const handleOpenDeleteGameStatsDialog = useCallback(
    (gameStats: GameStats) => {
      setGameStatsToDelete(gameStats);
      setIsDeleteGameStatsDialogOpen(true);
    },
    []
  );

  const getUsersInvolvedInGame = useCallback(
    (gameStats: GameStats) =>
      gameStats.usersInvolved
        .map((userId) => users.find((user) => user.id === userId)?.displayName)
        .filter((userName) => !!userName)
        .join(", "),
    [users]
  );

  return (
    <>
      <Accordion
        expanded={isGamesStatsHistoryExpanded}
        onChange={onGamesStatsHistoryExpand}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1} width={1}>
            <Typography
              variant="h6"
              sx={{
                width: isAtLeastLargeSizeScreen ? "30%" : "100%",
                flexShrink: 0,
              }}
            >
              Historia zanotowanych gier
            </Typography>
            {isAtLeastLargeSizeScreen && lastGameStats && (
              <Typography sx={{ color: "text.secondary" }}>
                Ostatnia gra: {lastGameStats.date} (zbanowani:{" "}
                {lastGameStats.bans}, wykopani: {lastGameStats.kicks})
              </Typography>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {areGamesStatsLoading || !hasGamesHistoryBeenExpanded ? (
            <Box
              width={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="5rem"
            >
              <CircularProgress />
            </Box>
          ) : (
            <List
              dense
              subheader={
                <ListSubheaderWithNoBackground>
                  Lista gier
                </ListSubheaderWithNoBackground>
              }
            >
              <PaperWithNoBackground
                style={{ maxHeight: "15rem", overflow: "auto" }}
                elevation={0}
              >
                {gamesStats.length ? (
                  gamesStats
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((gameStats, i) => (
                      <ListItem
                        key={gameStats.id}
                        divider={i !== gamesStats.length - 1}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() =>
                              handleOpenDeleteGameStatsDialog(gameStats)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={gameStats.date}
                          secondary={
                            <>
                              <Box paddingLeft={1}>
                                zbanowani: {gameStats.bans}, wykopani:{" "}
                                {gameStats.kicks}
                              </Box>
                              <Box paddingLeft={2}>
                                ({getUsersInvolvedInGame(gameStats)})
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                    ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Brak zanotowanych gier" />
                  </ListItem>
                )}
              </PaperWithNoBackground>
              {!!gamesStats.length && (
                <>
                  <Divider orientation="horizontal" />
                  <Box marginTop={1}>
                    <ListItem>
                      <ListItemText
                        secondary={`Łącznie: ${gamesStats.length}`}
                      />
                    </ListItem>
                  </Box>
                </>
              )}
            </List>
          )}
        </AccordionDetails>
      </Accordion>
      <DeleteGameStatsConfirmationDialog
        isOpen={isDeleteGameStatsDialogOpen}
        onClose={handleCloseDeleteGameStatsDialog}
        gameStats={gameStatsToDelete}
        users={users}
        totalGamesStats={totalGamesStats}
      />
    </>
  );
};
