import React, { useMemo, useRef, useState } from "react";

import "react-quill/dist/quill.snow.css";
import { Box, Container, Typography, Chip, Divider } from "@mui/material";

import {
  Attachment,
  TicketDetail,
} from "@/features/support/support-team/types";
import { ThreadRenderer } from "@/features/support/support-team/components/SupportThreadBubble";
import { ReplyActionBar } from "@/features/support/support-team/components/ReplyActionBar";
import { InlineReplyPanel } from "@/features/support/support-team/components/InlineReplyPanel";

// ---------- Right Pane Container (Header + Thread + Reply Action + Inline Panel) ----------
export default function SupportTicketDetailPane({
  detail,
  onUpload,
  onSend,
}: {
  detail: TicketDetail;
  onUpload?: (file: File) => Promise<Attachment>;
  onSend: (payload: {
    html: string;
    attachments: Attachment[];
  }) => Promise<void> | void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);

  const handleCloseTicket = () => {
    if (window.confirm("Are you sure you want to close this ticket?")) {
      console.log("Close ticket", detail.id);
    }
  };

  const wrappedSend = async (payload: {
    html: string;
    attachments: Attachment[];
  }) => {
    await onSend(payload);
    // keep behavior: close panel after send
    setReplyOpen(false);
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
          <Chip size="small" label={detail.status} />
          <Chip size="small" label={`${detail.priority} Priority`} />
          <Chip size="small" label={`${detail.department} Department`} />
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
              requesterEmail={detail.requester?.email}
              onSend={wrappedSend}
              onUpload={onUpload}
              onCancel={() => setReplyOpen(false)}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
