import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  AlertColor,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Slide,
  SlideProps,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import { useUsers } from "../hooks";
import { SnackbarContext } from "../contexts";
import { AccountStack } from "./accounts/AccountStack";
import { GlobalStatistics } from "./statistics/GlobalStatistics";

export const Content = () => {
  const theme = useTheme();
  const isAtLeastLargeSizeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState<AlertColor>("info");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [closeSnackbarTimeoutId, setCloseSnackbarTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  const { users, isLoading } = useUsers();

  const addSnackbar = useCallback(
    (message: string, type: AlertColor = "success") => {
      if (closeSnackbarTimeoutId) {
        clearTimeout(closeSnackbarTimeoutId);
        setCloseSnackbarTimeoutId(null);
      }

      setSnackbarType(type);
      setSnackbarMessage(message);
      setIsSuccessSnackbarOpen(true);
    },
    [closeSnackbarTimeoutId]
  );

  const onCloseSnackbar = useCallback(
    (_?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setIsSuccessSnackbarOpen(false);
      setSnackbarType("info");
      setSnackbarMessage("");

      if (closeSnackbarTimeoutId) {
        clearTimeout(closeSnackbarTimeoutId);
        setCloseSnackbarTimeoutId(null);
      }
    },
    [closeSnackbarTimeoutId]
  );

  useEffect(() => {
    if (isSuccessSnackbarOpen && !closeSnackbarTimeoutId) {
      const timeoutId = setTimeout(() => {
        onCloseSnackbar();
      }, 5000);

      setCloseSnackbarTimeoutId(timeoutId);
    }

    return () => {
      if (closeSnackbarTimeoutId) {
        clearTimeout(closeSnackbarTimeoutId);
        setCloseSnackbarTimeoutId(null);
      }
    };
  }, [closeSnackbarTimeoutId, isSuccessSnackbarOpen, onCloseSnackbar]);

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
      <SnackbarContext.Provider value={{ addSnackbar }}>
        <GlobalStatistics users={users} />
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
        <Snackbar
          open={isSuccessSnackbarOpen}
          autoHideDuration={6000}
          onClose={onCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={(props: SlideProps) => (
            <Slide {...props} direction="up" />
          )}
        >
          <Alert
            onClose={onCloseSnackbar}
            severity={snackbarType}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </SnackbarContext.Provider>
    </Grid>
  );
};
