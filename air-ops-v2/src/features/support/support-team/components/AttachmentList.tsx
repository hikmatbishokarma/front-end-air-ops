import { Box, IconButton, Paper, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Attachment } from "../types";
import { formatKB } from "../utils";

// ---------- UI: Attachments List ----------
// ---------- UI: Attachments List ----------
export const AttachmentsList = ({
  attachments,
}: {
  attachments: string[];
}) => {
  const cloudfrontBaseUrl = import.meta.env.VITE_CLOUDFRONT_BASE_URL || "http://localhost:3000/";

  return (
    <Box sx={{ mt: 1.5, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 1 }}>
      {attachments.map((fileKey, index) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileKey);
        const fileName = fileKey.split("/").pop() || fileKey;
        const fileUrl = `${cloudfrontBaseUrl}${fileKey}`;

        if (isImage) {
          return (
            <Paper
              key={index}
              elevation={0}
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                aspectRatio: "1/1",
                cursor: "pointer",
                "&:hover .overlay": { opacity: 1 },
              }}
              onClick={() => window.open(fileUrl, "_blank")}
            >
              <Box
                component="img"
                src={fileUrl}
                alt={fileName}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(0,0,0,0.3)",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DownloadIcon sx={{ color: "white" }} />
              </Box>
            </Paper>
          );
        }

        return (
          <Paper
            key={index}
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid #E5E7EB",
              borderRadius: 2,
              p: 1,
              bgcolor: "#F8FAFC",
              minWidth: 0, // Allow flex item to shrink
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={fileName}
              >
                {fileName}
              </Typography>
            </Box>
            <IconButton
              size="small"
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              sx={{
                width: 24,
                height: 24,
                bgcolor: "#E2E8F0",
                "&:hover": { bgcolor: "#CBD5E1" }
              }}
            >
              <DownloadIcon sx={{ fontSize: 14, color: "#475467" }} />
            </IconButton>
          </Paper>
        );
      })}
    </Box>
  );
};
