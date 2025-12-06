import React, { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MediaUpload from "@/components/MediaUpload";
import { FileObject } from "@/shared/types/common";
import { useAddMessageToTicket } from "@/features/support/support-team/hooks/useSupportTicketMutations";

export default function ReplyBox({ ticketId, onSent }: { ticketId: string; onSent?: () => void }) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<FileObject[]>([]);

  const { addMessage, loading } = useAddMessageToTicket();

  const handleAttachmentUpload = (fileObject: FileObject | null) => {
    if (fileObject) {
      setAttachments((prev) => [...prev, fileObject]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const result = await addMessage({
      ticketId,
      message: `<p>${text}</p>`,
      attachments: attachments.map((att) => att.key),
    });

    if (result.success) {
      setText("");
      setAttachments([]);
      onSent?.();
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        border: "1px solid #E5E7EB",
        borderRadius: 2,
        boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Typography sx={{ fontWeight: 600, mb: 1 }}>
        Reply to AirOps Support
      </Typography>

      <TextField
        multiline
        minRows={4}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message…"
        sx={{ mb: 2 }}
      />

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

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {/* Send button */}
        <Button
          variant="contained"
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          onClick={handleSend}
          disabled={!text.trim() || loading}
          sx={{ textTransform: "none", px: 3 }}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </Box>
    </Box>
  );
}
