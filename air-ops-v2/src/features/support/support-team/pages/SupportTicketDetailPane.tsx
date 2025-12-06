import React, { useState } from "react";

import "react-quill/dist/quill.snow.css";
import { Box, Container, Typography, Chip, Divider } from "@mui/material";

import { TicketDetail } from "@/features/support/support-team/types";
import { ThreadRenderer } from "@/features/support/support-team/components/SupportThreadBubble";
import { ReplyActionBar } from "@/features/support/support-team/components/ReplyActionBar";
import { InlineReplyPanel } from "@/features/support/support-team/components/InlineReplyPanel";
import { useUpdateSupportTicket } from "../hooks/useSupportTicketMutations";

// ---------- Right Pane Container (Header + Thread + Reply Action + Inline Panel) ----------
export default function SupportTicketDetailPane({
  detail,
  onRefetch,
}: {
  detail: TicketDetail;
  onRefetch?: () => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const { updateTicket } = useUpdateSupportTicket();

  const handleCloseTicket = async () => {
    if (window.confirm("Are you sure you want to close this ticket?")) {
      const result = await updateTicket(detail.id, { status: "CLOSED" });
      if (result.success) {
        onRefetch?.();
      }
    }
  };

  const handleReplySent = () => {
    setReplyOpen(false);
    onRefetch?.();
  };

  return (
    <Box
      sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", overflowY: "auto" }}
    >
      {/* Header */}
      <Container maxWidth="lg" sx={{ pt: 3, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {detail.subject}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            size="small"
            label={detail.status}
            sx={{
              borderRadius: "12px",
              bgcolor: "#E9F3FF",
              color: "#1F5B98",
            }}
          />
          <Chip
            size="small"
            label={detail.priority}
            sx={{
              borderRadius: "12px",
              bgcolor: "#FFF4E5",
              color: "#D97A05",
            }}
          />
          <Chip
            size="small"
            label={detail.department}
            sx={{
              borderRadius: "12px",
              bgcolor: "#F3F4F6",
              color: "#374151",
            }}
          />
        </Box>
      </Container>

      <Divider />

      {/* Messages + action bar + inline panel (all inside the same container for perfect alignment) */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <ThreadRenderer detail={detail} />

        {/* show action bar only when reply panel is NOT open */}
        {!replyOpen && (
          <ReplyActionBar
            onReplyClick={() => setReplyOpen(true)}
            onClose={handleCloseTicket}
          />
        )}

        {/* inline panel (aligned to same container) */}
        {replyOpen && (
          <Box>
            <InlineReplyPanel
              ticketId={detail.id}
              requesterEmail={detail.requester?.email}
              onSent={handleReplySent}
              onCancel={() => setReplyOpen(false)}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
