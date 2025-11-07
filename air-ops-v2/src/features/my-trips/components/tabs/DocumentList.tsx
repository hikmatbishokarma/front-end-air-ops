import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface DocItem {
  name: string;
  url: string;
  key: string;
  uploadedAt: string;
  type: "pre" | "post";
  uploading?: boolean;
  progress?: number;
}

interface DocumentsListProps {
  documents: DocItem[];
  onDelete: (type: "pre" | "post", key: string) => void;
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onDelete,
}) => {
  if (documents.length === 0) {
    return (
      <Typography fontSize={14} color="text.secondary" mt={1}>
        No documents uploaded yet.
      </Typography>
    );
  }

  // Sort newest at top
  const sorted = [...documents].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  return (
    <Box mt={2}>
      {sorted.map((file) => (
        <Paper
          key={file.key}
          sx={{
            borderRadius: 3,
            border: "1px solid #e6e6e6",
            p: 2,
            mb: 2,
          }}
          elevation={0}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* File Info */}
            <Stack direction="row" spacing={2} alignItems="center">
              <InsertDriveFileIcon sx={{ fontSize: 26, color: "#666" }} />

              <Box>
                <Typography fontWeight={600} fontSize={15}>
                  {file.name}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mt={0.3}>
                  <Chip
                    label={file.type === "pre" ? "Pre-Flight" : "Post-Flight"}
                    size="small"
                    sx={{
                      height: 20,
                      bgcolor: file.type === "pre" ? "#e7f2ff" : "#e6f7ec",
                      color: file.type === "pre" ? "#2467b3" : "#2e7d32",
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  />

                  <Typography fontSize={13} color="text.secondary">
                    {formatTime(file.uploadedAt)}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            {/* Status + Delete */}
            <Stack direction="row" spacing={1} alignItems="center">
              {file.uploading ? (
                <Box sx={{ width: 60 }}>
                  <LinearProgress variant="determinate" value={file.progress} />
                </Box>
              ) : (
                <CheckCircleIcon sx={{ fontSize: 20, color: "#4caf50" }} />
              )}

              <IconButton onClick={() => onDelete(file.type, file.key)}>
                <DeleteIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export default DocumentsList;
