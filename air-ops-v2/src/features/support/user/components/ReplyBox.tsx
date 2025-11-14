import React, { useRef, useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";

export default function ReplyBox({ onSend }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const pickFile = () => fileRef.current?.click();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files || []);
    if (!chosen.length) return;
    setFiles((prev) => [...prev, ...chosen]);
    e.target.value = "";
  };

  const handleSend = () => {
    onSend({
      message: text.trim(),
      attachments: files,
    });

    setText("");
    setFiles([]);
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

      {/* Attached file tags */}
      {files.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {files.map((f, i) => (
            <Typography
              key={i}
              sx={{ fontSize: 14, color: "#374151", mb: 0.5 }}
            >
              📎 {f.name}
            </Typography>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Attach button */}
        <div>
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={handleFiles}
          />

          <IconButton onClick={pickFile}>
            <AttachFileIcon />
          </IconButton>
        </div>

        {/* Send button */}
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!text.trim()}
          sx={{ textTransform: "none", px: 3 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
