import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SendIcon from "@mui/icons-material/Send";
import { Attachment } from "../types";
import { AttachmentsList } from "./AttachmentList";

export const InlineReplyPanel = ({
  requesterEmail,
  onSend,
  onUpload,
  onCancel,
}: {
  requesterEmail?: string;
  onSend: (payload: { html: string; attachments: Attachment[] }) => void;
  onUpload?: (file: File) => Promise<Attachment>;
  onCancel: () => void;
}) => {
  const [html, setHtml] = useState<string>("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

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

  const pickFile = () => fileRef.current?.click();

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files || []);
    if (!chosen.length) return;

    if (onUpload) {
      for (const f of chosen) {
        const meta = await onUpload(f);
        setFiles((p) => [...p, meta]);
      }
    } else {
      // Local fallback
      setFiles((p) => [
        ...p,
        ...chosen.map((f) => ({ id: String(Math.random()), name: f.name })),
      ]);
    }
    e.target.value = "";
  };

  const handleSend = () => {
    onSend({ html, attachments: files });
    setHtml("");
    setFiles([]);
    onCancel();
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

        {/* Attachments preview */}
        {files.length > 0 && <AttachmentsList attachments={files} />}

        {/* Actions row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
            bgcolor: "#F4F5F7",
          }}
        >
          {/* Attach (icon-only) */}
          <IconButton onClick={pickFile}>
            <AttachFileIcon />
          </IconButton>
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={handleFiles}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Cancel (icon-only) */}
            <IconButton onClick={onCancel}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>

            {/* Send (icon + text) */}
            <Button
              onClick={handleSend}
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ textTransform: "none" }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
