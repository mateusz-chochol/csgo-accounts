import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useRemainingBanTime } from "../../hooks";
import { BanAccountDialog } from "./BanAccountDialog";
import { ChangeAccountNameDialog } from "./ChangeAccountNameDialog";
import { DeleteAccountConfirmationDialog } from "./DeleteAccountConfirmationDialog";
import { UnbanAccountConfirmationDialog } from "./UnbanAccountConfirmationDialog";
import { getFormattedBanTime } from "../../utils";

interface AccountCardProps {
  id: string;
  displayName: string;
  banUntil: string | null;
  banCounter: number;
  totalBanTime: number;
  lastBanTime: number;
  ownerId: string;
}

export const AccountCard = ({
  id,
  displayName,
  banUntil,
  banCounter,
  totalBanTime,
  lastBanTime,
  ownerId,
}: AccountCardProps) => {
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  const [popoverAnchorElement, setPopoverAnchorElement] =
    useState<HTMLButtonElement | null>(null);

  const remainingBanTime = useRemainingBanTime(banUntil, ownerId);

  return (
    <Card variant={remainingBanTime ? "outlined" : "elevation"}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">{displayName}</Typography>
          <IconButton
            aria-label="account-info"
            onClick={(e) => setPopoverAnchorElement(e.currentTarget)}
          >
            <InfoIcon htmlColor="#D3D3D3" />
          </IconButton>
          <Popover
            id={!!popoverAnchorElement ? `${id}-popover` : undefined}
            open={!!popoverAnchorElement}
            anchorEl={popoverAnchorElement}
            onClose={() => setPopoverAnchorElement(null)}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
          >
            {banCounter > 0 ? (
              <>
                <Typography sx={{ p: 2 }}>
                  To konto zostało do tej pory zbanowane {banCounter}{" "}
                  {banCounter === 1 ? "raz" : "razy"}.
                </Typography>
                <Typography sx={{ p: 2 }}>
                  Ostatni czas bana wynosił {getFormattedBanTime(lastBanTime)}.
                </Typography>
                <Typography sx={{ p: 2 }}>
                  Łącznie konto było zbanowane przez{" "}
                  {getFormattedBanTime(totalBanTime)}.
                </Typography>
              </>
            ) : (
              <Typography sx={{ p: 2 }}>
                To konto nie zostało jeszcze zbanowane
              </Typography>
            )}
          </Popover>
        </Box>
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
