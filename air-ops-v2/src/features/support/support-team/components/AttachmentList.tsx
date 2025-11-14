import { Box, IconButton, Paper, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { Attachment } from "../types";
import { formatKB } from "../utils";

// ---------- UI: Attachments List ----------
export const AttachmentsList = ({
  attachments,
}: {
  attachments: Attachment[];
}) => {
  return (
    <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
      {attachments.map((file) => (
        <Paper
          key={file.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid #E5E7EB",
            borderRadius: 1.5,
            px: 1,
            py: 0.5,
            bgcolor: "#F8FAFC",
            minWidth: 120,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {file.name}
          </Typography>
          {file.sizeBytes ? (
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {formatKB(file.sizeBytes)}
            </Typography>
          ) : null}
          {file.url ? (
            <IconButton
              size="small"
              href={file.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`download ${file.name}`}
            >
              <DownloadIcon sx={{ fontSize: 16 }} />
            </IconButton>
          ) : null}
        </Paper>
      ))}
    </Box>
  );
};
