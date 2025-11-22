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
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import ThreadBubble from "@/features/support/user/components/ThreadBubble";
import ReplyBox from "@/features/support/user/components/ReplyBox";
import { useParams } from "react-router";
import { useUserTicketDetails } from "../hooks/useUserTicketQueries.hook";

export default function UserTicketDetailsPage({
  ticketId,
  onBack,
}: {
  ticketId: string;
  onBack: () => void;
}) {
  const { details, loading } = useUserTicketDetails(ticketId);

  console.log("details::::", details, ticketId);

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
        {details?.subject}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 2 }}>
        <Chip
          size="small"
          label={details?.status}
          sx={{
            borderRadius: "12px",
            bgcolor: "#E9F3FF",
            color: "#1F5B98",
          }}
        />
        <Chip
          size="small"
          label={details?.priority}
          sx={{
            borderRadius: "12px",
            bgcolor: "#FFF4E5",
            color: "#D97A05",
          }}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Thread */}
      <Box>
        {details?.messages?.map((msg, i) => (
          <ThreadBubble
            key={i}
            msg={msg}
            currentUserEmail={"hikmatbk101@gmail.com"}
          />
        ))}
      </Box>

      {/* Reply */}
      <ReplyBox
        onSend={(text) => {
          console.log("send reply:", text);
        }}
      />
    </Container>
  );
}
