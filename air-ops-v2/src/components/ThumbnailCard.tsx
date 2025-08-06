import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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

  console.log("url:::", url);

  return (
    // <Card
    //   elevation={2}
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     height: "100%",
    //     width: 200,
    //     borderRadius: 2,
    //   }}
    // >
    //   <Box
    //     onClick={() => onClick(doc)}
    //     sx={{
    //       height: 150,
    //       bgcolor: "#f0f0f0",
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //       borderBottom: "1px solid #eee",
    //       overflow: "hidden",
    //       position: "relative",
    //       cursor: "pointer",
    //     }}
    //   >
    //     {doc.attachment.endsWith(".pdf") ? (
    //       <Document
    //         file={url}
    //         onLoadError={(err) => console.error("PDF load error", err)}
    //         loading={<div style={{ height: 150 }}>Loading...</div>}
    //       >
    //         <div style={{ backgroundColor: "#f0f0f0", padding: 4 }}>
    //           <Page pageNumber={1} width={200} />
    //         </div>
    //       </Document>
    //     ) : (
    //       <img
    //         src={`https://placehold.co/200x150/e0e0e0/555555?text=${doc?.attachment?.split(".").pop()?.toUpperCase()}`}
    //         alt="Document Thumbnail"
    //         style={{ width: "100%", height: "100%", objectFit: "cover" }}
    //         onError={(e: any) => {
    //           e.target.onerror = null;
    //           e.target.src =
    //             "https://placehold.co/200x150/e0e0e0/555555?text=DOC";
    //         }}
    //       />
    //     )}
    //   </Box>

    //   <CardContent
    //     sx={{
    //       flexGrow: 1,
    //       pt: 1.5,
    //       pb: 0.5,
    //       px: 2,
    //       position: "relative",
    //     }}
    //   >
    //     <Typography
    //       variant="subtitle1"
    //       sx={{ fontWeight: "bold", lineHeight: 1.3, mb: 0.5 }}
    //       noWrap
    //     >
    //       {doc.name}
    //     </Typography>

    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         alignItems: "flex-end",
    //         width: "100%",
    //       }}
    //     >
    //       <Box sx={{ flexGrow: 1, pr: 0.5 }}>
    //         <Typography
    //           variant="caption"
    //           color="text.secondary"
    //           sx={{ display: "block", lineHeight: 1.2 }}
    //         >
    //           {doc.name || "N/A"}
    //         </Typography>
    //         <Typography
    //           variant="caption"
    //           color="text.secondary"
    //           sx={{ display: "block", lineHeight: 1.2 }}
    //         >
    //           Department: {doc.department || "N/A"}
    //         </Typography>
    //       </Box>

    //       <IconButton
    //         aria-label="more actions"
    //         onClick={(event) => handleMenuClick(event, doc)}
    //         size="small"
    //         sx={{ p: 0.5, alignSelf: "flex-end" }}
    //       >
    //         <MoreVertIcon fontSize="small" />
    //       </IconButton>
    //     </Box>
    //   </CardContent>
    // </Card>
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

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {doc.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Department: {doc.department}
        </Typography>
        {/* <Typography variant="caption" color="text.secondary" display="block">
          Type: {doc.department}
        </Typography> */}
      </CardContent>
    </Card>
  );
};

export default PdfThumbnailCard;
