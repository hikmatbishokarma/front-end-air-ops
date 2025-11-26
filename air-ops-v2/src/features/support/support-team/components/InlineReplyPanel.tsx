import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MediaUpload from "@/components/MediaUpload";
import { FileObject } from "@/shared/types/common";
import { useAddMessageToTicket } from "../hooks/useSupportTicketMutations";

export const InlineReplyPanel = ({
  ticketId,
  requesterEmail,
  onCancel,
  onSent,
}: {
  ticketId: string;
  requesterEmail?: string;
  onCancel: () => void;
  onSent?: () => void;
}) => {
  const [html, setHtml] = useState<string>("");
  const [attachments, setAttachments] = useState<FileObject[]>([]);

  const { addMessage, loading } = useAddMessageToTicket();

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [false, 3] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote"],
        ["link"],
      ],
    }),
    []
  );

  const handleAttachmentUpload = (fileObject: FileObject | null) => {
    if (fileObject) {
      setAttachments((prev) => [...prev, fileObject]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const result = await addMessage({
      ticketId,
      message: html,
      attachments: attachments.map((att) => att.key),
    });

    if (result.success) {
      setHtml("");
      setAttachments([]);
      onSent?.();
      onCancel();
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        mt: 2,
        borderRadius: 2,
        overflow: "hidden", // ensures header blends with body
        boxShadow: "0 6px 18px rgba(15,23,42,0.03)",
      }}
    >
      {/* HEADER — GRAY BAR */}
      <Box
        sx={{
          bgcolor: "#F4F5F7",
          px: 2,
          py: 1.5,
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Avatar
          sx={{ bgcolor: "#E6EDF7", width: 36, height: 36, color: "#0F62FE" }}
        >
          A
        </Avatar>

        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            From: AirOps Support (support@airops.in)
          </Typography>

          <Typography sx={{ fontSize: 13, mt: 0.3 }}>
            To: {requesterEmail ?? "Unknown"}
          </Typography>
        </Box>
      </Box>

      {/* WHITE BODY SECTION */}
      <Box sx={{ p: 2, bgcolor: "#FFFFFF" }}>
        {/* Editor */}
        <Box
          sx={{
            border: "1px solid #E8EBEF",
            borderRadius: 1,
            mb: 2,
            p: 0.5,
          }}
        >
          <ReactQuill value={html} onChange={setHtml} modules={modules} />
        </Box>

        {/* Attachments */}
        <Box sx={{ mb: 2 }}>
          {attachments.map((attachment, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <MediaUpload
                onUpload={(fileObject) => {
                  if (fileObject) {
                    setAttachments((prev) => {
                      const newAttachments = [...prev];
                      newAttachments[index] = fileObject;
                      return newAttachments;
                    });
                  } else {
                    handleRemoveAttachment(index);
                  }
                }}
                value={attachment}
                label={`Attachment ${index + 1}`}
                category="support-attachments"
                size="medium"
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </Box>
          ))}

          {/* Add new attachment */}
          <MediaUpload
            onUpload={handleAttachmentUpload}
            value={null}
            label="Add Attachment"
            category="support-attachments"
            size="medium"
            accept=".pdf,.png,.jpg,.jpeg"
          />
        </Box>

        {/* Actions row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 2,
            gap: 1,
          }}
        >
          {/* Cancel (icon-only) */}
          <Button
            onClick={onCancel}
            startIcon={<DeleteOutlineOutlinedIcon />}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          {/* Send (icon + text) */}
          <Button
            onClick={handleSend}
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
