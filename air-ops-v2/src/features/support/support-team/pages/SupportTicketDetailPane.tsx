import React, { useState } from "react";

import "react-quill/dist/quill.snow.css";
import {
  Box,
  Container,
  Typography,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { TicketDetail } from "@/features/support/support-team/types";
import { ThreadRenderer } from "@/features/support/support-team/components/SupportThreadBubble";
import { ReplyActionBar } from "@/features/support/support-team/components/ReplyActionBar";
import { InlineReplyPanel } from "@/features/support/support-team/components/InlineReplyPanel";
import { useUpdateSupportTicket } from "../hooks/useSupportTicketMutations";

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return { bgcolor: "#E9F3FF", color: "#1F5B98" };
    case "IN_PROGRESS":
      return { bgcolor: "#FFF4E5", color: "#D97A05" };
    case "RESOLVED":
      return { bgcolor: "#E8F5E9", color: "#2E7D32" };
    case "CLOSED":
      return { bgcolor: "#F3F4F6", color: "#6B7280" };
    default:
      return { bgcolor: "#E9F3FF", color: "#1F5B98" };
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return { bgcolor: "#E8F5E9", color: "#2E7D32" };
    case "MEDIUM":
      return { bgcolor: "#FFF4E5", color: "#D97A05" };
    case "HIGH":
      return { bgcolor: "#FFE5E5", color: "#D32F2F" };
    case "URGENT":
      return { bgcolor: "#F3E5F5", color: "#7B1FA2" };
    default:
      return { bgcolor: "#FFF4E5", color: "#D97A05" };
  }
};

// ---------- Right Pane Container (Header + Thread + Reply Action + Inline Panel) ----------
export default function SupportTicketDetailPane({
  detail,
  onRefetch,
}: {
  detail: TicketDetail;
  onRefetch?: () => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(null);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const { updateTicket } = useUpdateSupportTicket();

  const handleConfirmCloseTicket = async () => {
    setCloseDialogOpen(false);
    const result = await updateTicket(detail.id, { status: "CLOSED" });
    if (result.success) {
      onRefetch?.();
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const result = await updateTicket(detail.id, { status: newStatus });
    if (result.success) {
      onRefetch?.();
    }
    setStatusAnchor(null);
  };

  const handlePriorityChange = async (newPriority: string) => {
    const result = await updateTicket(detail.id, { priority: newPriority });


    if (result.success) {
      onRefetch?.();
    }
    setPriorityAnchor(null);
  };

  const handleReplySent = () => {
    setReplyOpen(false);
    onRefetch?.();
  };

  console.log("detail:::", detail);

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
            deleteIcon={<KeyboardArrowDownIcon />}
            onDelete={(e) => setStatusAnchor(e.currentTarget)}
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            sx={{
              borderRadius: "12px",
              cursor: "pointer",
              ...getStatusColor(detail.status),
              "& .MuiChip-deleteIcon": {
                color: "inherit",
              },
            }}
          />
          <Menu
            anchorEl={statusAnchor}
            open={Boolean(statusAnchor)}
            onClose={() => setStatusAnchor(null)}
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem
                key={status}
                onClick={() => handleStatusChange(status)}
                selected={status === detail.status}
              >
                {status.replace("_", " ")}
              </MenuItem>
            ))}
          </Menu>

          <Chip
            size="small"
            label={detail.priority}
            deleteIcon={<KeyboardArrowDownIcon />}
            onDelete={(e) => setPriorityAnchor(e.currentTarget)}
            onClick={(e) => setPriorityAnchor(e.currentTarget)}
            sx={{
              borderRadius: "12px",
              cursor: "pointer",
              ...getPriorityColor(detail.priority),
              "& .MuiChip-deleteIcon": {
                color: "inherit",
              },
            }}
          />
          <Menu
            anchorEl={priorityAnchor}
            open={Boolean(priorityAnchor)}
            onClose={() => setPriorityAnchor(null)}
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <MenuItem
                key={priority}
                onClick={() => handlePriorityChange(priority)}
                selected={priority === detail.priority}
              >
                {priority}
              </MenuItem>
            ))}
          </Menu>

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
            onClose={() => setCloseDialogOpen(true)}
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

      {/* Close Ticket Confirmation Dialog */}
      <Dialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
        aria-labelledby="close-ticket-dialog-title"
      >
        <DialogTitle id="close-ticket-dialog-title">
          Close Ticket
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to close this ticket? This action will mark the ticket as resolved and closed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmCloseTicket} color="error" variant="contained" autoFocus>
            Close Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
