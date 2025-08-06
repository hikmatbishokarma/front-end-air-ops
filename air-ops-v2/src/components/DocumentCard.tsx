import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardActionArea, Typography } from "@mui/material";

// 👇 Import worker correctly using Vite syntax
import PdfWorker from "pdfjs-dist/build/pdf.worker?worker";

pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker(); // ✅ Use workerPort instead of workerSrc

interface DocumentCardProps {
  url: string;
  title: string;
  onClick: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ url, title, onClick }) => {
  return (
    <Card sx={{ width: 200 }}>
      <CardActionArea onClick={onClick}>
        <Document
          file={url}
          onLoadError={(error) => console.error("PDF load error:", error)}
          loading={<div style={{ height: 150 }}>Loading...</div>}
          error={<div style={{ height: 150 }}>Preview unavailable</div>}
        >
          <Page pageNumber={1} width={200} renderMode="svg" />
        </Document>
        <Typography variant="subtitle2" sx={{ p: 1 }} noWrap title={title}>
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default DocumentCard;
