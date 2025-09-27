// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import { Box, Typography, Paper, Button, LinearProgress } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// // Example: replace this with your actual API base URL
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// const UploadPlaceholder = ({
//   label,
//   getRootProps,
//   getInputProps,
//   handleFileChange,
//   size = "medium",
// }) => {
//   let boxHeight, fontSize, padding;

//   switch (size) {
//     case "small":
//       boxHeight = "44px"; // match MUI input height
//       fontSize = "0.875rem";
//       padding = 1;
//       break;
//     case "large":
//       boxHeight = "200px";
//       fontSize = "1rem";
//       padding = 3;
//       break;
//     case "banner":
//       boxHeight = "180px";
//       fontSize = "1rem";
//       padding = 3;
//       break;
//     default:
//       boxHeight = "120px";
//       fontSize = "1rem";
//       padding = 2;
//   }

//   return (
//     <>
//       {label && (
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ display: size === "small" ? "none" : "block" }}
//         >
//           Upload {label}
//         </Typography>
//       )}

//       <Paper
//         {...getRootProps()}
//         sx={{
//           padding,
//           height: boxHeight,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           border: "2px dashed #1976d2",
//           backgroundColor: "#f9f9f9",
//           cursor: "pointer",
//           borderRadius: 2,
//           "&:hover": { backgroundColor: "#f0f0f0" },
//         }}
//       >
//         <input {...getInputProps()} onChange={handleFileChange} />

//         <Box textAlign="center" sx={{ fontSize }}>
//           <CloudUploadIcon
//             color="primary"
//             fontSize="small"
//             sx={{ display: size === "small" ? "none" : "block", mb: 1 }}
//           />
//           <Typography variant="body2" color="text.secondary" sx={{ fontSize }}>
//             Drag & Drop or{" "}
//             <span style={{ color: "#1976d2", cursor: "pointer" }}>
//               Choose File
//             </span>
//           </Typography>
//         </Box>
//       </Paper>
//     </>
//   );
// };

// const UploadProgress = ({ progress }) => (
//   <Box sx={{ mt: 2 }}>
//     <Typography variant="caption" color="text.secondary">
//       Uploading: {progress}%
//     </Typography>
//     <LinearProgress
//       variant="determinate"
//       value={progress}
//       sx={{
//         mt: 1,
//         borderRadius: 2,
//         height: "6px",
//         backgroundColor: "#f0f0f0",
//         "& .MuiLinearProgress-bar": { backgroundColor: "#1976d2" },
//       }}
//     />
//   </Box>
// );

// const UploadedPreview = ({ value, label, onChangeImage, size = "medium" }) => {
//   let imageSize;
//   switch (size) {
//     case "small":
//       imageSize = { width: 80, height: 80, borderRadius: "50%" }; // avatar
//       break;
//     case "large":
//       imageSize = { width: 300, height: "auto", borderRadius: "8px" };
//       break;
//     case "banner":
//       imageSize = { width: "100%", height: "auto", borderRadius: "8px" };
//       break;
//     default:
//       imageSize = { width: 150, height: "auto", borderRadius: "8px" };
//   }

//   return (
//     <Box sx={{ mt: 2, textAlign: "center" }}>
//       <img
//         src={`${apiBaseUrl}${value}`}
//         alt="Uploaded"
//         style={{
//           ...imageSize,
//           marginBottom: "16px",
//           objectFit: "cover",
//         }}
//       />
//       <Typography variant="body2" color="text.secondary">
//         {label}
//       </Typography>
//       <Button
//         variant="text"
//         sx={{
//           mt: 2,
//           color: "#1976d2",
//           textTransform: "none",
//           fontSize: "14px",
//           "&:hover": {
//             backgroundColor: "transparent",
//             textDecoration: "underline",
//           },
//         }}
//         onClick={onChangeImage}
//       >
//         Change Image
//       </Button>
//     </Box>
//   );
// };

// const FileUpload = ({
//   onUpload,
//   value,
//   label = "",
//   category = "others",
//   size = "medium",
//   accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg",
// }) => {
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const onDrop = (acceptedFiles) => {
//     const selectedFile = acceptedFiles[0];
//     if (selectedFile) handleFileUpload(selectedFile);
//   };

//   const handleFileChange = async (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) handleFileUpload(selectedFile);
//   };

//   const handleFileUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     setUploading(true);
//     try {
//       const response = await axios.post(
//         `${apiBaseUrl}api/media/upload/${category}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           onUploadProgress: (progressEvent) => {
//             const percent = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setProgress(percent);
//           },
//         }
//       );
//       const uploadedImageUrl = response.data.filePath;
//       onUpload(uploadedImageUrl);
//     } catch (error) {
//       console.error("Upload error:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleChangeImage = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     multiple: false,
//     // accept: { "image/*": [] },
//     accept: {
//       "image/*": [],
//       "application/pdf": [],
//       "application/msword": [],
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//         [],
//     },
//   });

//   return (
//     <Box
//       sx={{ textAlign: "center", width: "100%", maxWidth: 400, margin: "auto" }}
//     >
//       {!value && !uploading && (
//         <UploadPlaceholder
//           label={label}
//           getRootProps={getRootProps}
//           getInputProps={getInputProps}
//           handleFileChange={handleFileChange}
//         />
//       )}

//       {uploading && <UploadProgress progress={progress} />}

//       {value && !uploading && (
//         <UploadedPreview
//           value={value}
//           label={label}
//           onChangeImage={handleChangeImage}
//           size={size}
//         />
//       )}

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         // accept="image/*"
//         accept={accept}
//         onChange={handleFileChange}
//         style={{ display: "none" }}
//       />
//     </Box>
//   );
// };

// export default FileUpload;

import React, { useState, useRef } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  IconButton, // ⬅️ Added IconButton
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete"; // ⬅️ New Import

// Example: replace this with your actual API base URL
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/"; // Ensure it ends with a slash if needed

const UploadPlaceholder = ({
  label,
  getRootProps,
  getInputProps,
  handleFileChange,
  size = "medium",
}) => {
  let boxHeight, fontSize, padding;

  switch (size) {
    case "small":
      boxHeight = "44px"; // match MUI input height
      fontSize = "0.875rem";
      padding = 1;
      break;
    case "large":
      boxHeight = "200px";
      fontSize = "1rem";
      padding = 3;
      break;
    case "banner":
      boxHeight = "180px";
      fontSize = "1rem";
      padding = 3;
      break;
    default:
      boxHeight = "200px"; // Default height is now 200px
      fontSize = "1rem";
      padding = 2;
  }

  return (
    <>
      {label && (
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ display: size === "small" ? "none" : "block" }}
        >
          {label}
        </Typography>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          padding,
          height: boxHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed #1976d2",
          backgroundColor: "#f9f9f9",
          cursor: "pointer",
          borderRadius: 2,
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
      >
        <input {...getInputProps()} onChange={handleFileChange} />

        <Box textAlign="center" sx={{ fontSize }}>
          <CloudUploadIcon
            color="primary"
            fontSize="small"
            sx={{ display: size === "small" ? "none" : "block", mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize }}>
            Drag & Drop or{" "}
            <span style={{ color: "#1976d2", cursor: "pointer" }}>
              Choose File
            </span>
          </Typography>
        </Box>
      </Paper>
    </>
  );
};

const UploadProgress = ({ progress }) => (
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
        "& .MuiLinearProgress-bar": { backgroundColor: "#1976d2" },
      }}
    />
  </Box>
);

const UploadedPreview = ({
  value,
  onDelete,
  onReplace,
  size = "medium",
  label,
}) => {
  // We'll use a fixed height for the container based on the screenshot (200px)
  const imageContainerSize = {
    width: "100%",
    height: size === "small" ? 120 : 200, // Adjust height based on size prop
  };

  return (
    <>
      {label && (
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ display: size === "small" ? "none" : "block" }}
        >
          {label}
        </Typography>
      )}
      <Paper
        // Make the entire area clickable to trigger file replacement
        onClick={onReplace}
        sx={{
          ...imageContainerSize,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed #ddd", // Subtle dashed border
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
          overflow: "hidden",
          cursor: "pointer",
          mt: 2,
        }}
      >
        {/* Image Centered in Container (objectFit: 'contain' recommended for logos) */}
        <img
          src={`${apiBaseUrl}${value}`}
          alt="Uploaded Preview"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            objectFit: "contain",
            borderRadius: "4px",
            zIndex: 1,
          }}
        />

        {/* Trash/Delete Icon */}
        <IconButton
          // 🛑 IMPORTANT: Stop propagation so clicking the icon doesn't trigger replacement
          onClick={(e) => {
            e.stopPropagation();
            onDelete(value);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            "&:hover": { backgroundColor: "white" },
            borderRadius: "50%",
            p: 1,
          }}
        >
          <DeleteIcon color="error" fontSize="small" />
        </IconButton>
      </Paper>
    </>
  );
};

const FileUpload = ({
  onUpload, // RHF update function (sets new URL or clears to '')
  value, // Current RHF value (string URL)
  label = "",
  category = "others",
  size = "medium",
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg",
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null); // Type assertion removed for simplicity in this context

  // --- Upload Handlers ---

  const handleFileUpload = async (file) => {
    // ... (Your existing handleFileUpload logic)
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}api/media/upload/${category}`,
        formData
        // ... (axios config)
      );
      const uploadedImageUrl = response.data.filePath;
      onUpload(uploadedImageUrl); // Update RHF with new URL
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // ⭐️ NEW: Deletion Logic
  const handleFileDelete = async (url) => {
    // Attempt to extract filename from URL path
    const filename = url.split("/").pop();

    try {
      // 1. API call to delete the file
      await axios.delete(`${apiBaseUrl}api/media/delete/${category}`, {
        params: { filename },
      });

      // 2. Clear the RHF form value
      onUpload("");
    } catch (error) {
      console.error("Delete error:", error);
      // Even if API fails, clear the local form state to avoid broken links
      onUpload("");
    }
  };

  // ⭐️ NEW: Replacement Logic (triggered by clicking the UploadedPreview box)
  const handleReplaceImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- Dropzone and Change Handlers ---

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) handleFileUpload(selectedFile);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) handleFileUpload(selectedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
      "application/pdf": [],
      // ... (rest of accept types)
    },
  });

  // --- Render ---

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
      {/* 1. Show Upload Placeholder if no value and not uploading */}
      {!value && !uploading && (
        <UploadPlaceholder
          label={label}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          handleFileChange={handleFileChange}
        />
      )}

      {/* 2. Show Progress Bar during upload */}
      {uploading && <UploadProgress progress={progress} />}

      {/* 3. Show New Preview Design if value exists and not uploading */}
      {value && !uploading && (
        <UploadedPreview
          value={value}
          onDelete={handleFileDelete} // Passed the new delete handler
          onReplace={handleReplaceImage} // Passed the replacement handler
          size={size}
          label={label}
        />
      )}

      {/* Hidden file input (used by both placeholder and preview for replacement) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default FileUpload;
