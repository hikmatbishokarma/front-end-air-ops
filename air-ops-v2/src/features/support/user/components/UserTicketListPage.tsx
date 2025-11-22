import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";

/**
 * ticket: {
 *   id
 *   subject
 *   status
 *   priority
 *   updatedAt
 * }
 */

export default function UserTicketListPane({ tickets, onOpenTicket }: any) {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        My Support Tickets
      </Typography>

      <List disablePadding>
        {tickets.map((t) => (
          <ListItemButton
            key={t.id}
            onClick={() => onOpenTicket(t.id)}
            sx={{
              mb: 1.5,
              borderRadius: 2,
              p: 2,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E7ECF3",
              boxShadow: "0px 1px 3px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                borderColor: "#D5DBE2",
              },
            }}
          >
            <Avatar
              sx={{
                mr: 2,
                width: 40,
                height: 40,
                bgcolor: "#E4E9F0",
                color: "#374151",
                fontWeight: 600,
              }}
            >
              {t.subject[0]}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }} noWrap>
                {t.subject}
              </Typography>

              <Typography
                variant="body2"
                noWrap
                sx={{ color: "#6B7280", mt: 0.3 }}
              >
                Updated {t.updatedAt}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip
                  size="small"
                  label={t.status}
                  sx={{
                    borderRadius: "12px",
                    bgcolor: "#E9F3FF",
                    color: "#1F5B98",
                    fontWeight: 500,
                    height: 22,
                  }}
                />
                <Chip
                  size="small"
                  label={t.priority}
                  sx={{
                    borderRadius: "12px",
                    bgcolor: "#FFF4E5",
                    color: "#D97A05",
                    fontWeight: 500,
                    height: 22,
                  }}
                />
              </Box>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
}
