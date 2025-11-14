import { Avatar, Box, Paper, Typography } from "@mui/material";
import { Message, TicketDetail } from "../types";
import { isRequester } from "../utils";
import { AttachmentsList } from "./AttachmentList";

// ---------- UI: Message Bubble ----------
export const MessageBubble = ({
  msg,
  requesterEmail,
}: {
  msg: Message;
  requesterEmail?: string;
}) => {
  const requester = isRequester(msg, requesterEmail);
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      <Avatar
        sx={{
          bgcolor: requester ? "#6C6C6C" : "#1976D2",
          width: 36,
          height: 36,
          fontSize: 14,
        }}
        aria-label={msg.author?.name ?? "author"}
      >
        {msg.author?.name?.[0]?.toUpperCase() ?? "?"}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            p: 2,
            bgcolor: "#FFFFFF",
            boxShadow: "0px 6px 18px rgba(15, 23, 42, 0.03)",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.75 }}>
            {msg.author?.name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.75 }}>
            {new Date(msg.createdAt).toLocaleString()}
          </Typography>

          <Box
            sx={{
              "& p": { m: 0, fontSize: 14, lineHeight: 1.6, color: "#111827" },
            }}
            dangerouslySetInnerHTML={{ __html: msg.html }}
          />

          {msg.attachments && msg.attachments.length > 0 && (
            <AttachmentsList attachments={msg.attachments} />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

// ---------- UI: Thread (scrollable) ----------
export const ThreadRenderer = ({ detail }: { detail: TicketDetail }) => {
  return (
    <Box sx={{ pb: 2 }}>
      {detail.messages.map((m) => (
        <MessageBubble
          key={m.id}
          msg={m}
          requesterEmail={detail.requester?.email}
        />
      ))}
    </Box>
  );
};
