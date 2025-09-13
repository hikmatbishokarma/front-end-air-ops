// import React from "react";
// import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// interface DocumentPreviewDialogProps {
//   open: boolean;
//   url: string;
//   onClose: () => void;
//   apiBaseUrl?: string;
// }

// const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
//   open,
//   url,
//   onClose,
//   apiBaseUrl = "",
// }) => {
//   if (!url) return null;

//   const fullUrl = `${apiBaseUrl}${url}`;
//   let previewType: "pdf" | "doc" | "image" | "other" = "other";

//   if (url.endsWith(".pdf")) previewType = "pdf";
//   else if (url.endsWith(".doc") || url.endsWith(".docx")) previewType = "doc";
//   else if (
//     url.endsWith(".png") ||
//     url.endsWith(".jpg") ||
//     url.endsWith(".jpeg")
//   )
//     previewType = "image";

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>
//         Document Preview
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent dividers style={{ height: "80vh" }}>
//         {previewType === "pdf" && (
//           <iframe
//             src={fullUrl}
//             width="100%"
//             height="100%"
//             style={{ border: "none" }}
//           />
//         )}

//         {previewType === "doc" && (
//           <iframe
//             src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
//               fullUrl
//             )}`}
//             width="100%"
//             height="100%"
//             style={{ border: "none" }}
//           />
//         )}

//         {previewType === "image" && (
//           <img
//             src={fullUrl}
//             alt="Preview"
//             style={{ maxWidth: "100%", maxHeight: "100%" }}
//           />
//         )}

//         {previewType === "other" && <p>Cannot preview this file type.</p>}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DocumentPreviewDialog;

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

// // 👇 Import worker correctly using Vite syntax
import PdfWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker(); // ✅ Use workerPort instead of workerSrc

const DocumentPreviewDialog = ({ open, url, onClose, apiBaseUrl }) => {
  console.log("url:::", url);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // inside your DocumentPreviewDialog component
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [open]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleDownload = () => {
    const fullUrl = `${apiBaseUrl}${url}`;
    window.open(fullUrl, "_blank");
  };

  const goToPrevPage = () => setPageNumber(pageNumber - 1);
  const goToNextPage = () => setPageNumber(pageNumber + 1);

  const getFileType = (url) => {
    if (!url) return "other";

    const parts = url.split(".");
    const extension = parts[parts.length - 1].toLowerCase();

    switch (extension) {
      case "pdf":
        return "pdf";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "image";
      case "doc":
      case "docx":
        return "docx";
      default:
        return "other";
    }
  };

  const renderPdfContent = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Box
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Document
          file={`${apiBaseUrl}${url}`}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={containerWidth} />
        </Document>
      </Box>
      <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
        <IconButton onClick={goToPrevPage} disabled={pageNumber <= 1}>
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Typography>
          {pageNumber} of {numPages}
        </Typography>
        <IconButton onClick={goToNextPage} disabled={pageNumber >= numPages}>
          <ArrowForwardIosRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  );

  const renderNonPdfContent = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        padding: 4,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Cannot display this file type.
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Please download the file to view its content.
      </Typography>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        sx={{ mt: 2 }}
        onClick={handleDownload}
      >
        Download
      </Button>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          zIndex: 1, // Ensure the icon is on top of the content
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        dividers
        sx={{
          paddingTop: "64px", // Add padding to make space for the close button
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div ref={containerRef} style={{ width: "100%" }}>
          {getFileType(url) === "pdf"
            ? renderPdfContent()
            : renderNonPdfContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;
