import React from "react";
import { Avatar, Box, Typography, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { ThreadMessage } from "../../types";

export default function ThreadBubble({
  msg,
  currentUserEmail,
}: {
  msg: ThreadMessage;
  currentUserEmail?: string;
}) {
  const isUser =
    msg.author.email?.toLowerCase() === currentUserEmail?.toLowerCase();

  const avatarBG = isUser ? "#6366F1" : "#0F62FE";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 2,
        mb: 3,
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          bgcolor: avatarBG,
          width: 36,
          height: 36,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {msg.author.name?.[0]?.toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        {/* Message Card */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Name + Email */}
          <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.25 }}>
            {isUser ? "You" : `${msg.author.name} (${msg.author.email})`}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
              mt: 0.5,
              textAlign: isUser ? "right" : "left",
            }}
          >
            {new Date(msg.createdAt).toLocaleString()}
          </Typography>

          {/* Body */}
          <Box
            sx={{
              fontSize: 14,
              lineHeight: 1.55,
              color: "#374151",
              "& p": { m: 0, mb: 1 },
            }}
            dangerouslySetInnerHTML={{ __html: msg.message }}
          />

          {/* Attachments */}
          {msg.attachments && msg.attachments.length > 0 && (
            <Box
              sx={{
                mt: 1.5,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)", // ⭐ 2 per row
                gap: 1,
              }}
            >
              {msg.attachments.map((file) => (
                <Box
                  key={file.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    border: "1px solid #E5E7EB",
                    borderRadius: 1,
                    bgcolor: "#F9FAFB",
                    gap: 1,
                    minHeight: 40,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      flex: 1,
                      color: "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    📎 {file.name}
                  </Typography>

                  <IconButton
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
