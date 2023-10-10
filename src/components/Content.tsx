import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { AccountStack } from "./AccountStack";
import { useUsers } from "../hooks";

export const Content = () => {
  const theme = useTheme();
  const isAtLeastLargeSizeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const { users, isLoading } = useUsers();

  if (isLoading) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={100} />
      </Box>
    );
  }

  return (
    <Grid container minHeight="100vh" maxWidth="100vw">
      {users.map((user, index, usersArray) => (
        <React.Fragment key={user.id}>
          <Grid
            item
            xs={12}
            lg={4}
            display="flex"
            flexDirection={isAtLeastLargeSizeScreen ? "row" : "column"}
            justifyContent="space-between"
          >
            <Box width="100%" padding={2}>
              <AccountStack
                ownerId={user.id}
                ownerDisplayName={user.displayName}
              />
            </Box>
            {index === usersArray.length - 1 ? null : (
              <Box padding={1}>
                <Divider
                  orientation={
                    isAtLeastLargeSizeScreen ? "vertical" : "horizontal"
                  }
                />
              </Box>
            )}
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};
