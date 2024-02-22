import React from "react";
import { ListSubheader, ListSubheaderProps, styled } from "@mui/material";

export const ListSubheaderWithNoBackground = styled(
  (props: ListSubheaderProps) => <ListSubheader {...props} />
)(() => ({
  backgroundColor: "unset",
  paddingLeft: 0,
}));
