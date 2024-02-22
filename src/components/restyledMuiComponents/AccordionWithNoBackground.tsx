import React from "react";
import { Accordion, AccordionProps, styled } from "@mui/material";

export const AccordionWithNoBackground = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(() => ({
  backgroundImage: "none",
}));
