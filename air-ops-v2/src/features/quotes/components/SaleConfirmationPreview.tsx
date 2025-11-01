import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { Box, Paper, IconButton } from "@mui/material";
import ActionButton from "@/components/ActionButton";
import PrintIcon from "@mui/icons-material/Print";

interface SaleConfirmationPreviewProps {
  htmlContent: string | null;
  currentQuotation: any;
  showGenerateTI?: boolean;
  onGenerateInvoice?: ({ type, quotationNo }) => void;
}

const SaleConfirmationPreview: React.FC<SaleConfirmationPreviewProps> = ({
  htmlContent,
  currentQuotation,
  showGenerateTI,
  onGenerateInvoice,
}) => {
  useEffect(() => {
    // Extract styles and apply them to the document head
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent || "";
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

  const sanitizedHTML = DOMPurify.sanitize(htmlContent || "", {
    ADD_TAGS: ["style"],
  });

  const componentRef = React.useRef(null);

  console.log("currentQuotation:::", currentQuotation);

  return (
    <Box>
      {/* ActionButton positioned on the right */}
      <ActionButton
        currentId={""}
        currentQuotation={currentQuotation}
        htmlRef={componentRef}
        documentType="SALE_CONFIRMATION"
        editPath=""
        showEdit={false}
        showPrint={true}
        showDownload={true}
        showEmail={true}
        showGenerateTI={showGenerateTI}
        onGenerateInvoice={onGenerateInvoice}
      />
      <div
        ref={componentRef}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </Box>
  );
};

export default SaleConfirmationPreview;
