import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import { Box, Paper, Typography } from "@mui/material";

const FlightQuotePreview = ({ htmlContent }) => {
  useEffect(() => {
    // Extract styles and apply them to the document head
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const styleTags = tempDiv.getElementsByTagName("style");

    if (styleTags.length > 0) {
      const styleContent = styleTags[0].innerHTML;
      const styleElement = document.createElement("style");
      styleElement.innerHTML = styleContent;
      document.head.appendChild(styleElement);
    }
  }, [htmlContent]);

  const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
    ADD_TAGS: ["style"],
  });

  return (
    <Box>
      <Paper elevation={3} sx={{ padding: 2, overflow: "auto" }}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
      </Paper>
    </Box>
  );
};

export default FlightQuotePreview;
