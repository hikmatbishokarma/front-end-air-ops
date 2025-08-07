import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

// 👇 Import worker correctly using Vite syntax
import PdfWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker(); // ✅ Use workerPort instead of workerSrc

interface Doc {
  name: string;
  department?: string;
  attachment: string;
}

interface Props {
  doc: Doc;
  onClick: (doc: Doc) => void;
  handleMenuClick: (event: React.MouseEvent, doc: Doc) => void;
}

const PdfThumbnailCard: React.FC<Props> = ({
  doc,
  onClick,
  handleMenuClick,
}) => {
  const url = `${apiBaseUrl}/${doc.attachment}`;
  const isPDF = doc.attachment.toLowerCase().endsWith(".pdf");

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          height: 150,
          bgcolor: "#e0e0e0",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "hidden",
        }}
      >
        {isPDF ? (
          <Document
            file={url}
            onLoadError={(err) => console.error("PDF load error", err)}
            loading={<Typography variant="caption">Loading PDF...</Typography>}
          >
            <Page
              pageNumber={1}
              width={180}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        ) : (
          <Box
            component="img"
            src={doc.attachment}
            alt="Preview"
            sx={{ height: "100%", width: "auto", objectFit: "cover" }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          p: 1.5,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left content (icon + text) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PictureAsPdfIcon fontSize="small" color="error" />
            <Typography
              variant="subtitle2"
              fontWeight={600}
              noWrap
              sx={{ flex: 1, fontSize: "0.875rem" }}
            >
              {doc.name}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ ml: 4, fontSize: "0.75rem" }}
          >
            Department: {doc.department}
          </Typography>
        </Box>

        {/* Menu button */}
        <IconButton
          aria-label="actions"
          onClick={(event) => handleMenuClick(event, doc)}
          size="small"
          sx={{ ml: 1 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default PdfThumbnailCard;
