import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useRemainingBanTime } from "../hooks";
import { BanAccountDialog } from "./BanAccountDialog";
import { ChangeAccountNameDialog } from "./ChangeAccountNameDialog";
import { DeleteAccountConfirmationDialog } from "./DeleteAccountConfirmationDialog";
import { UnbanAccountConfirmationDialog } from "./UnbanAccountConfirmationDialog";

interface AccountCardProps {
  id: string;
  displayName: string;
  banUntil: string | null;
  ownerId: string;
}

export const AccountCard = ({
  id,
  displayName,
  banUntil,
  ownerId,
}: AccountCardProps) => {
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);

  const remainingBanTime = useRemainingBanTime(banUntil);

  return (
    <Card variant={remainingBanTime ? "outlined" : "elevation"}>
      <CardContent>
        <Typography variant="h6">{displayName}</Typography>
        {remainingBanTime && (
          <>
            <Typography variant="body1" color="text.secondary">
              Zbanowane do: {banUntil}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pozostało jeszcze: {remainingBanTime}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        <Box display="inline-flex" justifyContent="space-between" width="100%">
          <Box>
            {remainingBanTime ? (
              <Button
                color="primary"
                variant="contained"
                onClick={() => setIsUnbanDialogOpen(true)}
              >
                Odbanuj
              </Button>
            ) : (
              <Button
                color="error"
                variant="contained"
                onClick={() => setIsBanDialogOpen(true)}
              >
                Zbanuj
              </Button>
            )}
          </Box>
          <Box display="flex" flexShrink={0}>
            <Button
              color="primary"
              onClick={() => setIsChangeNameDialogOpen(true)}
            >
              Zmień nazwę
            </Button>
            <Button color="error" onClick={() => setIsDeleteDialogOpen(true)}>
              Usuń konto
            </Button>
          </Box>
        </Box>
      </CardActions>
      <BanAccountDialog
        isOpen={isBanDialogOpen}
        onClose={() => setIsBanDialogOpen(false)}
        accountId={id}
        accountDisplayName={displayName}
        accountOwnerId={ownerId}
      />
      <ChangeAccountNameDialog
        isOpen={isChangeNameDialogOpen}
        onClose={() => setIsChangeNameDialogOpen(false)}
        accountId={id}
        accountDisplayName={displayName}
        accountOwnerId={ownerId}
      />
      <DeleteAccountConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        accountId={id}
        accountDisplayName={displayName}
        accountOwnerId={ownerId}
      />
      <UnbanAccountConfirmationDialog
        isOpen={isUnbanDialogOpen}
        onClose={() => setIsUnbanDialogOpen(false)}
        accountId={id}
        accountDisplayName={displayName}
        accountOwnerId={ownerId}
      />
    </Card>
  );
};
