import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { Box, Paper, IconButton } from "@mui/material";
import ActionButton from "./ActionButton"; // Assuming ActionButton is already a reusable component
import PrintIcon from "@mui/icons-material/Print";

const TripConfirmationPreview = ({ htmlContent, currentQuotation }) => {
  useEffect(() => {
    // Extract styles and apply them to the document head
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const styleTags = tempDiv.getElementsByTagName("style");

    const styleElements: HTMLStyleElement[] = [];

    for (let i = 0; i < styleTags.length; i++) {
      const styleContent = styleTags[i].innerHTML;
      const styleElement = document.createElement("style");
      styleElement.innerHTML = styleContent;
      document.head.appendChild(styleElement);
      styleElements.push(styleElement);
    }

    return () => {
      // Cleanup styles when component unmounts or htmlContent updates
      styleElements.forEach((styleElement) =>
        document.head.removeChild(styleElement)
      );
    };
  }, [htmlContent]);

  const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
    ADD_TAGS: ["style"],
  });

  const componentRef = React.useRef(null);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
      {/* ActionButton positioned on the right */}
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <ActionButton
          currentId={""}
          currentQuotation={currentQuotation}
          htmlRef={componentRef}
          documentType="TRIP_CONFIRMATION"
          editPath=""
          showEdit={false}
          showPrint={true}
          showDownload={true}
          showEmail={true}
        />
      </Box>

      {/* A4 size container */}
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          width: "210mm", // A4 Width in mm
          height: "297mm", // A4 Height in mm
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Invoice content */}
        <div
          ref={componentRef}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </Paper>
    </Box>
  );
};

export default TripConfirmationPreview;
