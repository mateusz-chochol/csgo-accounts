import React from "react";
import { Paper, PaperProps, styled } from "@mui/material";

export const PaperWithNoBackground = styled((props: PaperProps) => (
  <Paper {...props} />
))(() => ({
  backgroundColor: "unset",
}));
