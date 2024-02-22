import React from "react";
import { AccordionSummary, AccordionSummaryProps, styled } from "@mui/material";

export const AccordionSummaryWithCloserIcon = styled(
  (props: AccordionSummaryProps) => <AccordionSummary {...props} />
)(() => ({
  justifyContent: "flex-start",
  gap: "1rem",
  "& .MuiAccordionSummary-content": {
    flexGrow: 0,
  },
}));
