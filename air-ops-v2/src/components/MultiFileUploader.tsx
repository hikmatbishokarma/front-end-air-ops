import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Paper,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MultiFileUpload = ({
  value = [],
  onUpload,
  label,
  category = "others",
  onChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/media/uploads/${category}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },

          onUploadProgress: (event: any) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        }
      );

      const uploadedImageUrl = response.data.filePath;
      onUpload(uploadedImageUrl); // Add image to form field
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (url) => {
    const filename = url.split("/").pop();

    try {
      await axios.delete(`http://localhost:3000/api/media/delete/${category}`, {
        params: { filename },
      });

      const updatedValue = value.filter((v) => v !== url);
      onChange(updatedValue); // Update form field
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [] },
  });

  return (
    <Box>
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
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon color="primary" fontSize="large" />
        <Typography variant="body2" color="text.secondary">
          Drag & Drop or Click to Upload
        </Typography>
      </Paper>

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

      <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
        {value?.map((img, index) => (
          <Box key={index} position="relative">
            <img
              src={`http://localhost:3000/${img}`}
              alt=""
              width={100}
              style={{ borderRadius: 8 }}
            />
            <IconButton
              size="small"
              sx={{ position: "absolute", top: 0, right: 0 }}
              onClick={() => handleDelete(img)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MultiFileUpload;
