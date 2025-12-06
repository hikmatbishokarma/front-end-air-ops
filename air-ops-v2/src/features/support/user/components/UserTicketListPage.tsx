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
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AddIcon from "@mui/icons-material/Add";
import { formatRelativeTime } from "@/shared/utils";

const cloudfrontBaseUrl =
  import.meta.env.VITE_CLOUDFRONT_BASE_URL || "http://localhost:3000/";

/**
 * Format date to relative time (e.g., "4 years ago")
 */


/**
 * Format date to full format (e.g., "Sun, 5 Dec 2021 at 12:49 AM")
 */
const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * ticket: {
 *   id
 *   subject
 *   status
 *   priority
 *   updatedAt
 *   requester: {
 *     profile
 *     displayName
 *     fullName
 *   }
 * }
 */

export default function UserTicketListPane({ tickets, onCreate, onOpenTicket }: any) {
  const navigate = useNavigate();

  const getAvatarProps = (ticket: any) => {
    const requester = ticket.requester;
    if (!requester) {
      return {
        src: undefined,
        children: ticket.subject?.[0] || "?",
      };
    }

    // Use profile image if available
    if (requester.profile) {
      return {
        src: `${cloudfrontBaseUrl}${requester.profile}`,
        children: undefined,
      };
    }

    // Use first letter of displayName or fullName
    const initial = (requester.displayName || requester.fullName)?.[0] || "?";
    return {
      src: undefined,
      children: initial,
    };
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          My Support Tickets
        </Typography>
      </Box>

      {tickets.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            backgroundColor: "#FAFBFC",
            borderRadius: 3,
            border: "1px dashed #D5DBE2",
          }}
        >
          <SupportAgentIcon
            sx={{
              fontSize: 80,
              color: "#9CA3AF",
              mb: 2,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#374151" }}>
            No Support Tickets Yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280", mb: 3, maxWidth: 400, mx: "auto" }}>
            You haven't created any support tickets. Need help? Create your first ticket and our support team will assist you.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{ textTransform: "none", px: 3 }}
          >
            Create Your First Ticket
          </Button>
        </Box>
      ) : (
        <List disablePadding>
          {tickets.map((t) => {
            const avatarProps = getAvatarProps(t);
            return (
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
                  src={avatarProps.src}
                  sx={{
                    mr: 2,
                    width: 40,
                    height: 40,
                    bgcolor: "#E4E9F0",
                    color: "#374151",
                    fontWeight: 600,
                  }}
                >
                  {avatarProps.children}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 15 }} noWrap>
                    {t.subject}
                  </Typography>

                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ color: "#374151", mt: 0.3, fontSize: "0.8rem" }}
                  >
                    {t.requester?.displayName || t.requester?.fullName || "Unknown User"} ({t.requester?.email || "No email"})
                  </Typography>

                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ color: "#6B7280", mt: 0.2, fontSize: "0.75rem" }}
                    title={formatFullDate(t.updatedAt)}
                  >
                    {formatRelativeTime(t.updatedAt)}
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
                        height: 20,
                        fontSize: "0.7rem",
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
                        height: 20,
                        fontSize: "0.7rem",
                      }}
                    />
                    <Chip
                      size="small"
                      label={t.department}
                      sx={{
                        borderRadius: "12px",
                        bgcolor: "#F3F4F6",
                        color: "#374151",
                        fontWeight: 500,
                        height: 20,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Container>
  );
}
