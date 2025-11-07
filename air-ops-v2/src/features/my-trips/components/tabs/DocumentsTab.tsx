// /components/sectors/tabs/DocumentsTab.tsx
import React from "react";
import { Box, Stack, Typography, IconButton, Paper, Chip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import { Sector } from "../../types/sector";

const DocumentsTab: React.FC<{ sector: Sector }> = ({ sector }) => {
  // Only keep docs that have externalLink
  const uploadedDocs = sector.documents.filter((d) => d.externalLink);

  return (
    <Box sx={{ maxWidth: 600 }}>
      {uploadedDocs.length === 0 && (
        <Typography color="text.secondary" fontSize={14}>
          No documents uploaded by Operations yet.
        </Typography>
      )}

      {uploadedDocs.map((doc, i) => (
        <Paper
          key={i}
          sx={{
            borderRadius: 3,
            border: "1px solid #e6e6e6",
            p: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          elevation={0}
        >
          {/* Left: icon + doc name */}
          <Stack direction="row" spacing={2} alignItems="center">
            <DescriptionIcon sx={{ fontSize: 30, color: "#8a8a8a" }} />

            <Box>
              <Typography fontWeight={600} fontSize={15}>
                {doc.type}
              </Typography>

              {/* <Chip
                label="Uploaded"
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: "#e8f5e9",
                  color: "#2e7d32",
                  fontWeight: 600,
                  height: 20,
                }}
              /> */}
            </Box>
          </Stack>

          {/* Right: download button */}
          <IconButton
            edge="end"
            href={doc.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ml: 1 }}
          >
            <DownloadIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Paper>
      ))}
    </Box>
  );
};

export default DocumentsTab;
