import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";

const MAX_FILES = 10;
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/"; // Ensure it ends with a slash if needed

// Define the structure of the S3 object stored in your RHF form
interface S3FileObject {
  key: string;
  url: string; // The signed S3 URL
}

// Define the component's props interface
interface MultiFileUploadProps {
  value?: S3FileObject[]; // Array of S3 objects
  onChange: (value: S3FileObject[]) => void; // Function that updates the form with the new array
  label?: string;
  category?: string;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  value = [], // Array of image URLs
  onChange, // Updates RHF state after deletion
  label, // e.g., "Media" or "Bus Images"
  category = "others", // API upload category
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileDelete = async (fileObject: S3FileObject) => {
    const { key } = fileObject;
    if (!key) return;

    try {
      // 1. Backend API call to delete the file
      await axios.delete(`${apiBaseUrl}api/media/delete`, {
        params: { key }, // Pass the full key as a query parameter
      });

      // 2. CRITICAL FIX: Filter the current 'value' array to remove the deleted file
      const updatedValue = value.filter((v) => v.key !== key);

      // 3. CRITICAL FIX: Use the 'onChange' prop to update the RHF field with the new array
      onChange(updatedValue);
    } catch (error) {
      console.error("Delete error:", error);

      // If the API fails but we want the preview to disappear anyway:
      // const updatedValue = value.filter((v) => v.key !== key);
      // onChange(updatedValue);
      // For safety, you might choose to only update on success.
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    await handleBatchFileUpload(acceptedFiles); // Call a new batch handler
  };

  const handleBatchFileUpload = async (files: File[]) => {
    if (value.length + files.length > MAX_FILES) {
      console.warn(`Cannot upload. Exceeds limit of ${MAX_FILES} images.`);
      return;
    }

    const formData = new FormData();
    // ⭐️ Key Change: Loop and append each file using the plural field name 'files'
    files.forEach((file) => {
      formData.append("files", file);
    });

    setUploading(true);

    try {
      const response = await axios.post(
        `${apiBaseUrl}api/media/uploads/${category}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        }
      );

      const uploadedFileObjects = response.data.files.map((file: any) => ({
        key: file.key,
        url: file.previewUrl, // Map the backend's 'previewUrl' to 'url'
      }));

      // Aggregate the new objects with the existing array of objects
      const updatedFormValue = [...value, ...uploadedFileObjects];

      // ⭐️ Final Fix: Call the RHF update function ONCE with the full array
      onChange(updatedFormValue);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [] },
    maxFiles: MAX_FILES - value.length,
    maxSize: MAX_SIZE_BYTES,
  });

  // --- Render Helpers ---

  const renderDropzoneContent = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: "#FEECE3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <ImageIcon sx={{ color: "#F7893B" }} />
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#333" }}>
        Drag and drop image here, or click add image
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
        Upload up to {MAX_FILES} images, not more than {MAX_SIZE_MB}mb each
      </Typography>
      {/* 
      <Button
        variant="contained"
        component="span"
        sx={{
          mt: 2,
          backgroundColor: "#FEECE3",
          color: "#F7893B",
          "&:hover": { backgroundColor: "#FCDDC7" },
          textTransform: "none",
          boxShadow: "none",
          fontWeight: 600,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        Add Image
      </Button> */}
    </Box>
  );

  const renderImageThumbnail = (fileObject: S3FileObject, index: number) => (
    <Grid
      item
      xs={12}
      sm={4}
      md={3}
      lg={2}
      key={`uploaded-${index}`}
      sx={{ minWidth: 120, position: "relative" }}
    >
      <Box
        position="relative"
        sx={{
          width: "100%",
          pt: "66.66%", // Aspect ratio 3:2 (adjust if needed)
          overflow: "hidden",
          borderRadius: 2, // Rounded corners for the thumbnail box
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Soft shadow
          border: "1px solid #ddd", // Subtle border
        }}
      >
        <img
          src={fileObject.url}
          alt={`Uploaded image ${index + 1}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 2, // Match border radius
          }}
        />

        {/* Delete Button (Retained) */}
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            "&:hover": { backgroundColor: "white" },
            p: 0.5,
            zIndex: 10,
            borderRadius: "50%", // Make the delete button round
          }}
          onClick={(e) => {
            e.stopPropagation();
            // 🔑 Pass the full object to handleDelete
            handleFileDelete(fileObject);
          }}
        >
          <CloseIcon fontSize="small" sx={{ color: "#F7893B" }} />
        </IconButton>

        {/* ⭐️ KEY CHANGE: Overlaid Label at the bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
            color: "white",

            textAlign: "center", // Align text to the left
            // Optional: rounded bottom corners if desired, matching the image
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
          }}
        >
          <Typography
            variant="caption" // Smaller text
            sx={{ fontWeight: 600 }}
          >
            {`Image ${index + 1}`}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label || "Media"}
      </Typography>

      {/* --- Main Dropzone Area --- */}
      <Paper
        {...getRootProps()}
        sx={{
          border: "2px dashed #ddd",
          backgroundColor: isDragActive ? "#f0f8ff" : "white",
          cursor: "pointer",
          borderRadius: 2,
          mb: 4,
        }}
      >
        <input {...getInputProps()} />
        {renderDropzoneContent()}
      </Paper>

      {/* --- Upload Progress Bar --- */}
      {uploading && (
        <Box sx={{ mt: -2, mb: 2, px: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Uploading: {progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1, height: 8, borderRadius: 4 }}
          />
        </Box>
      )}

      <Grid container spacing={2}>
        {/* Render uploaded image objects */}
        {value?.map((fileObject, index) => {
          // We already removed the isMain logic, but if you keep it, this is how you'd pass it
          // const isMain = index === 0;

          // Pass the entire fileObject (e.g., { key: '...', url: '...' })
          return renderImageThumbnail(fileObject, index);
        })}
      </Grid>
    </Box>
  );
};

export default MultiFileUpload;
