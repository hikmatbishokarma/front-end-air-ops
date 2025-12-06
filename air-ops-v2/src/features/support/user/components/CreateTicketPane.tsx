// src/features/support/user/components/CreateTicketPane.tsx

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MediaUpload from "@/components/MediaUpload";
import { FileObject } from "@/shared/types/common";
import { useCreateSupportTicket } from "@/features/support/support-team/hooks/useSupportTicketMutations";

export default function CreateTicketPane({
  faq,
  onBack,
  onCreated,
}: {
  faq?: React.ReactNode;
  onBack: () => void;
  onCreated: (ticketId: string) => void;
}) {
  // Form state
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<FileObject[]>([]);

  const { createTicket, loading } = useCreateSupportTicket();

  const handleAttachmentUpload = (fileObject: FileObject | null) => {
    if (fileObject) {
      setAttachments((prev) => [...prev, fileObject]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!department || !subject || !description) {
      alert("Please fill the form completely.");
      return;
    }

    const result = await createTicket({
      subject,
      status: "OPEN",
      priority: "MEDIUM",
      department,
      message: description,
      attachments: attachments.map((att) => att.key),
    });

    if (result.success && result.ticketId) {
      // Reset form
      setDepartment("");
      setSubject("");
      setDescription("");
      setAttachments([]);

      // Navigate to ticket details
      onCreated(result.ticketId);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {/* LEFT FORM AREA */}
        <Box sx={{ flex: 1 }}>
          {/* Back button */}
          <Button
            variant="text"
            onClick={onBack}
            sx={{ mb: 2, textTransform: "none", fontSize: 14 }}
          >
            ← Back
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Raise Support Ticket
          </Typography>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
              backgroundColor: "#FFFFFF",
            }}
          >
            {/* Department */}
            <TextField
              label="Department"
              select
              fullWidth
              size="small"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Operations">Operations</MenuItem>
              <MenuItem value="Billing">Billing</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Support">Support</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
            </TextField>

            {/* Subject */}
            <TextField
              label="Subject"
              fullWidth
              size="small"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  alignItems: "flex-start",
                  paddingTop: "10px",
                },
              }}
            />

            {/* Attachments */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Attachments
              </Typography>

              {/* Show existing attachments */}
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

              {/* Add new attachment button */}
              <MediaUpload
                onUpload={handleAttachmentUpload}
                value={null}
                label="Add Attachment"
                category="support-attachments"
                size="medium"
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </Box>

            {/* Submit */}
            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ textTransform: "none", px: 3 }}
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* RIGHT FAQ SECTION */}
        {/* {faq && (
          <Box sx={{ width: 360, position: "sticky", top: 20 }}>{faq}</Box>
        )} */}
      </Box>
    </Container>
  );
}
