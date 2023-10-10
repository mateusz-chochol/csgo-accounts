import { AlertColor } from "@mui/material";
import { createContext } from "react";

export const SnackbarContext = createContext({
  addSnackbar: (message: string, type: AlertColor = "success") => {},
});
