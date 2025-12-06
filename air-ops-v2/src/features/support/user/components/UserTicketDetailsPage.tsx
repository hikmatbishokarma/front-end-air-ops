import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import ThreadBubble from "@/features/support/user/components/ThreadBubble";
import ReplyBox from "@/features/support/user/components/ReplyBox";
import { useParams } from "react-router";
import { useUserTicketDetails } from "../hooks/useUserTicketQueries.hook";
import { useSession } from "@/app/providers";

export default function UserTicketDetailsPage({
  ticketId,
  onBack,
}: {
  ticketId: string;
  onBack: () => void;
}) {
  const { details, loading, refetch } = useUserTicketDetails(ticketId);
  const { session } = useSession();

  console.log("details:::", details);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading ticket details...</Typography>
      </Container>
    );
  }

  if (!details) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography color="error">Ticket not found</Typography>
        <Button onClick={onBack} sx={{ mt: 2 }}>
          ← Back to My Tickets
        </Button>
      </Container>
    );
  }

  const handleReplySent = () => {
    // Refetch ticket details to show new message
    refetch?.();
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Back */}
      <Typography
        sx={{
          mb: 2,
          color: "#2563EB",
          cursor: "pointer",
        }}
        onClick={onBack}
      >
        ← Back to My Tickets
      </Typography>

      {/* Header */}
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {details.subject}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 2 }}>
        <Chip
          size="small"
          label={details.status}
          sx={{
            borderRadius: "12px",
            bgcolor: "#E9F3FF",
            color: "#1F5B98",
          }}
        />
        <Chip
          size="small"
          label={details.priority}
          sx={{
            borderRadius: "12px",
            bgcolor: "#FFF4E5",
            color: "#D97A05",
          }}
        />
        {details.department && (
          <Chip
            size="small"
            label={details.department}
            sx={{
              borderRadius: "12px",
              bgcolor: "#F3F4F6",
              color: "#374151",
            }}
          />
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Thread */}
      <Box>
        {details.messages?.map((msg: any, i: number) => (
          <ThreadBubble
            key={i}
            msg={msg}
            currentUserEmail={session?.user?.email || ""}
          />
        ))}
      </Box>

      {/* Reply */}
      <ReplyBox ticketId={ticketId} onSent={handleReplySent} />
    </Container>
  );
}
