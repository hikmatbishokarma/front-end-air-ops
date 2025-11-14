// src/features/support/user/components/CreateTicketPane.tsx

import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

interface Attachment {
  id: string;
  name: string;
  file: File;
}

export default function CreateTicketPane({
  faq,
  onBack,
  onCreated,
}: {
  faq?: React.ReactNode;
  onBack: () => void;
  onCreated: (ticketId: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // pick files
  const pickFile = () => fileRef.current?.click();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files || []);
    if (!chosen.length) return;

    const mapped = chosen.map((file) => ({
      id: Math.random().toString(),
      name: file.name,
      file,
    }));

    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!department || !subject || !description) {
      alert("Please fill the form completely.");
      return;
    }

    // TODO: Replace this stub with GraphQL createTicket mutation
    const newFakeId = Math.random().toString();

    console.log("Creating ticket:", {
      department,
      subject,
      description,
      attachments,
    });

    // send ticketId back to controller
    onCreated(newFakeId);
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

              <input
                ref={fileRef}
                type="file"
                multiple
                hidden
                onChange={handleFiles}
              />

              <Button
                startIcon={<AttachFileIcon />}
                onClick={pickFile}
                sx={{
                  textTransform: "none",
                  borderRadius: 1.5,
                }}
              >
                Upload Files
              </Button>

              {attachments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {attachments.map((a) => (
                    <Typography
                      key={a.id}
                      sx={{ fontSize: 14, color: "#374151", mb: 0.5 }}
                    >
                      📄 {a.name}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            {/* Submit */}
            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
                sx={{ textTransform: "none", px: 3 }}
              >
                Submit Ticket
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
