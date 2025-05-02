import React, { useState, useRef } from "react";
import axios from "axios";
import { Box, Typography, LinearProgress, Paper, Button } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUpload = ({ onUpload, value, label, category = "others" }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Explicitly type the ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drop of files
  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  // Handle file selection from file picker
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/media/upload/${category}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent: any) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      const uploadedImageUrl = response.data.filePath;
      onUpload(uploadedImageUrl); // Send URL to parent (form)
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input on Change Image button click
  const handleChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click programmatically
    }
  };

  // React Dropzone hook
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  });

  return (
    <Box
      sx={{ textAlign: "center", width: "100%", maxWidth: 400, margin: "auto" }}
    >
      {!value && (
        <>
          <Typography variant="h6" gutterBottom>
            Upload {label}
          </Typography>

          <Paper
            {...getRootProps()}
            sx={{
              padding: 3,
              border: "2px dashed #1976d2",
              backgroundColor: "#f0f0f0", // Gray background
              cursor: "pointer",
              textAlign: "center",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#e3e3e3", // Lighter gray on hover
              },
            }}
          >
            <input {...getInputProps()} onChange={handleFileChange} />

            <CloudUploadIcon color="primary" fontSize="large" />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Drag & Drop a file here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#1976d2", cursor: "pointer" }}
              >
                Choose File
              </Typography>
            </Box>
          </Paper>
        </>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Uploading: {progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mt: 1,
              borderRadius: 2,
              height: "6px",
              backgroundColor: "#f0f0f0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#1976d2",
              },
            }}
          />
        </Box>
      )}

      {value && (
        <Box sx={{ mt: 2 }}>
          <img
            src={`http://localhost:3000/${value}`}
            alt="Uploaded"
            width="150"
            style={{
              borderRadius: "8px",
              marginBottom: "16px",
              maxWidth: "100%",
              objectFit: "cover",
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {label}
          </Typography>

          <Button
            variant="text"
            sx={{
              mt: 2,
              color: "#1976d2",
              textTransform: "none",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
            onClick={handleChangeImage}
          >
            Change Image
          </Button>
        </Box>
      )}

      {/* Hidden file input to trigger via button click */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default FileUpload;
