import { Dialog, DialogContent, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRef } from "react";
import { BoardingPassCard } from "./BoardingPassCard";
import ActionButton from "@/components/ActionButton";

interface BoardingPassPreviewDialogProps {
    open: boolean;
    onClose: () => void;
    data: any;
}

export const BoardingPassPreviewDialog = ({ open, onClose, data }: BoardingPassPreviewDialogProps) => {
    const componentRef = useRef<HTMLDivElement>(null);

    if (!data) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            {/* Header with Actions and Close Button */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #eee" }}>
                <Typography variant="h6" fontWeight="bold">Boarding Pass Preview</Typography>

                <Box display="flex" gap={1} alignItems="center">
                    <ActionButton
                        htmlRef={componentRef}
                        currentId=""
                        currentQuotation={data.quotationNo}
                        documentType="BOARDING_PASS"
                        tripId={data.tripId}
                        sectorNo={Number(data.sectorNo)}
                        showEdit={false}
                        showEmail={true}
                        showPrint={true}
                        showDownload={true}
                        currentRecord={{}}
                    />

                    <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            <DialogContent sx={{ p: 4, bgcolor: "#F5F7FA", display: "flex", justifyContent: "center" }}>
                <div ref={componentRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {/* Wrapper to ensure print styles are capturing the right content */}
                    <BoardingPassCard data={data} />
                </div>
            </DialogContent>
        </Dialog>
    );
};
