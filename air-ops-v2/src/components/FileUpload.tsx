import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, LinearProgress, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUpload = ({ onUpload, value, label }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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
        "https://airops.in/api/media/upload",
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
      sx={{
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        textAlign: "center",
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 4,
        boxShadow: 2,
        backgroundColor: "background.paper",
      }}
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
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
              textAlign: "center",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            <input {...getInputProps()} onChange={handleFileChange} />

            {/* Upload Icon */}
            <CloudUploadIcon color="primary" fontSize="large" />

            <Typography variant="body2" color="text.secondary">
              Drag & Drop a file here, or{" "}
              <span style={{ color: "#1976d2" }}>Choose File</span>
            </Typography>
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
            sx={{ mt: 1 }}
          />
        </Box>
      )}

      {value && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <img
            src={`https://airops.in/${value}`}
            alt="Uploaded"
            width="100"
            style={{ borderRadius: 8, marginTop: 8 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
