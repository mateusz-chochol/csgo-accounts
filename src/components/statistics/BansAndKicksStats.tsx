import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TotalGamesStats, User } from "../../types";
import { ListSubheaderWithNoBackground } from "../restyledMuiComponents";

interface BansAndKicksStatsProps {
  totalGamesStats: TotalGamesStats;
  users: User[];
}

export const BansAndKicksStats = ({
  totalGamesStats,
  users,
}: BansAndKicksStatsProps) => {
  const theme = useTheme();
  const isAtLeastLargeSizeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1} width={1}>
          <Typography
            variant="h6"
            sx={{
              width: isAtLeastLargeSizeScreen ? "30%" : "100%",
              flexShrink: 0,
            }}
          >
            Zbanowania i wykopania
          </Typography>
          {isAtLeastLargeSizeScreen && (
            <Typography sx={{ color: "text.secondary" }}>
              Łącznie zbanowania: {totalGamesStats.bans}, wykopania:{" "}
              {totalGamesStats.kicks}
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <List
          dense
          subheader={
            <ListSubheaderWithNoBackground>
              Łącznie
            </ListSubheaderWithNoBackground>
          }
        >
          <ListItem>
            <ListItemText primary={`Zbanowania: ${totalGamesStats.bans}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Wykopania: ${totalGamesStats.kicks}`} />
          </ListItem>
        </List>
        <Box paddingTop={1} paddingBlock={1}>
          <Divider orientation="horizontal" />
        </Box>
        <List
          dense
          subheader={
            <ListSubheaderWithNoBackground>
              Uczestnictwo
            </ListSubheaderWithNoBackground>
          }
        >
          {users.map((user) => (
            <ListItem key={user.id}>
              <ListItemText
                primary={user.displayName}
                secondary={`Zbanowania: ${user.bans}, wykopania: ${user.kicks}`}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
