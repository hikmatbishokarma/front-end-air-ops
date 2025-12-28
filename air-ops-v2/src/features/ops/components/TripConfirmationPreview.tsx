import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { Box } from "@mui/material";
import ActionButton from "@/components/ActionButton";

interface TripConfirmationPreviewProps {
    htmlContent: string | null;
    tripId: string;
    quotationNo?: string;
    currentRecord?: any;
}

const TripConfirmationPreview: React.FC<TripConfirmationPreviewProps> = ({
    htmlContent,
    tripId,
    quotationNo,
    currentRecord,
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

    return (
        <Box>
            <ActionButton
                currentId={""}
                currentQuotation={quotationNo || ""} // Pass quotationNo if available
                htmlRef={componentRef}
                documentType="TRIP_CONFIRMATION"
                tripId={tripId}
                currentRecord={currentRecord}
                editPath=""
                showEdit={false}
                showPrint={true}
                showDownload={true}
                showEmail={true}
            />
            <div
                ref={componentRef}
                dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
            />
        </Box>
    );
};

export default TripConfirmationPreview;
