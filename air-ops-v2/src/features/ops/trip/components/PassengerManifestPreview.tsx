import React, { useState, useRef, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { CustomDialog } from "@/components/CustomeDialog";
import ActionButton from "@/components/ActionButton";
import useGql from "@/lib/graphql/gql";
import { GENERATE_PASSENGER_MANIFEST } from "@/lib/graphql/queries/trip-detail";
import { useSnackbar } from "@/app/providers";
import DOMPurify from "dompurify";

interface PassengerManifestPreviewProps {
    tripId: string;
    sectorNo: number;
    open: boolean;
    onClose: () => void;
}

const PassengerManifestPreview: React.FC<PassengerManifestPreviewProps> = ({
    tripId,
    sectorNo,
    open,
    onClose,
}) => {
    const showSnackbar = useSnackbar();
    const [manifestHtml, setManifestHtml] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const manifestRef = useRef(null);

    useEffect(() => {
        if (open && tripId && sectorNo) {
            fetchManifest();
        }
    }, [open, tripId, sectorNo]);

    // Extract and inject styles from HTML content into document head
    useEffect(() => {
        if (!manifestHtml) return;

        // Extract styles and apply them to the document head
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = manifestHtml;
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
            // Cleanup styles when component unmounts or manifestHtml updates
            styleElements.forEach((styleElement) =>
                document.head.removeChild(styleElement)
            );
        };
    }, [manifestHtml]);

    const fetchManifest = async () => {
        setLoading(true);
        try {
            const response = await useGql({
                query: GENERATE_PASSENGER_MANIFEST,
                queryName: "generatePassengerManifest",
                queryType: "mutation",
                variables: {
                    input: {
                        tripId: tripId,
                        sectorNo: sectorNo,
                    },
                },
            });

            if (response) {
                setManifestHtml(response);
            } else {
                showSnackbar("Failed to generate manifest", "error");
            }
        } catch (error: any) {
            console.error("Error generating manifest:", error);
            showSnackbar(error?.message || "Failed to generate manifest", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="Passenger Manifest"
            width="950px"
            maxWidth="lg"
        >
            <Box>
                <ActionButton
                    currentId={tripId}
                    currentQuotation="manifest"
                    htmlRef={manifestRef}
                    documentType="MANIFEST"
                    showEdit={false}
                    showEmail={true}
                    showPrint={true}
                    showDownload={true}
                    tripId={tripId}
                    sectorNo={sectorNo}
                />
                <Paper elevation={3} sx={{ padding: 2, overflow: "auto", mt: 2 }}>
                    {loading ? (
                        <Box sx={{ textAlign: "center", py: 4 }}>Loading manifest...</Box>
                    ) : (
                        <div
                            ref={manifestRef}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(manifestHtml, { ADD_TAGS: ["style"] }),
                            }}
                        />
                    )}
                </Paper>
            </Box>
        </CustomDialog>
    );
};

export default PassengerManifestPreview;
