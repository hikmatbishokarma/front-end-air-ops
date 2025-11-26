import React from "react";
import { Avatar, Box, Typography, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { ThreadMessage } from "../../types";
import { formatRelativeTime, formatFullDate } from "@/shared/utils";

const cloudfrontBaseUrl =
  import.meta.env.VITE_CLOUDFRONT_BASE_URL || "http://localhost:3000/";

const isImage = (filename: string) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
};

export default function ThreadBubble({
  msg,
  currentUserEmail,
}: {
  msg: ThreadMessage;
  currentUserEmail?: string;
}) {
  const isUser =
    msg.author?.email?.toLowerCase() === currentUserEmail?.toLowerCase();

  const avatarBG = isUser ? "#6366F1" : "#0F62FE";

  // Prepare avatar source
  const profileUrl = msg.author?.profile
    ? `${cloudfrontBaseUrl}${msg.author.profile}`
    : undefined;

  const initial = msg.author?.name?.[0]?.toUpperCase() || "?";

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
        src={profileUrl}
        sx={{
          bgcolor: avatarBG,
          width: 40,
          height: 40,
          fontSize: 16,
          fontWeight: 600,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {!profileUrl && initial}
      </Avatar>

      <Box sx={{ flex: 1, maxWidth: "85%" }}>
        {/* Message Card */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
            position: "relative",
          }}
        >
          {/* Name + Email + Time */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              {isUser ? "You" : msg.author?.name || "Support Agent"}
              <Typography component="span" sx={{ fontSize: 12, color: "text.secondary", ml: 1, fontWeight: 400 }}>
                {msg.author?.email && `(${msg.author.email})`}
              </Typography>
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: "text.secondary",
                whiteSpace: "nowrap",
                ml: 2
              }}
              title={formatFullDate(msg.createdAt)}
            >
              {formatRelativeTime(msg.createdAt)}
            </Typography>
          </Box>

          {/* Body */}
          <Box
            sx={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "#374151",
              "& p": { m: 0, mb: 1 },
              "& a": { color: "#2563EB", textDecoration: "underline" },
            }}
            dangerouslySetInnerHTML={{ __html: msg.message }}
          />

          {/* Attachments */}
          {msg.attachments && msg.attachments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {/* Image Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: 1,
                  mb: 1
                }}
              >
                {msg.attachments.filter(file => isImage(file.name || file)).map((file, idx) => {
                  const fileUrl = typeof file === 'string' ? file : file.url;
                  const fileName = typeof file === 'string' ? file : file.name;
                  // If it's just a string (legacy), assume it's a relative path if it doesn't start with http
                  const src = fileUrl.startsWith('http') ? fileUrl : `${cloudfrontBaseUrl}${fileUrl}`;

                  return (
                    <Box
                      key={idx}
                      component="img"
                      src={src}
                      alt={fileName}
                      sx={{
                        width: "100%",
                        height: 90, // Reduced height
                        borderRadius: 1,
                        border: "1px solid #E5E7EB",
                        cursor: "pointer",
                        objectFit: "cover", // Better thumbnail crop
                        backgroundColor: "#F3F4F6",
                        transition: "opacity 0.2s",
                        "&:hover": { opacity: 0.9 }
                      }}
                      onClick={() => window.open(src, '_blank')}
                    />
                  );
                })}
              </Box>

              {/* Non-image Files */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {msg.attachments.filter(file => !isImage(file.name || file)).map((file, idx) => {
                  const fileUrl = typeof file === 'string' ? file : file.url;
                  const fileName = typeof file === 'string' ? file : file.name;
                  const href = fileUrl.startsWith('http') ? fileUrl : `${cloudfrontBaseUrl}${fileUrl}`;

                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1.5,
                        border: "1px solid #E5E7EB",
                        borderRadius: 1,
                        bgcolor: "#F9FAFB",
                        gap: 1.5,
                      }}
                    >
                      <InsertDriveFileIcon sx={{ color: "#6B7280" }} />
                      <Typography
                        sx={{
                          fontSize: 13,
                          flex: 1,
                          color: "#111827",
                          fontWeight: 500,
                          wordBreak: "break-all"
                        }}
                      >
                        {fileName}
                      </Typography>

                      <IconButton
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        sx={{ color: "#4B5563" }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
