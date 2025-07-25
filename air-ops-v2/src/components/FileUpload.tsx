// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { Box, Typography, LinearProgress, Paper, Button } from "@mui/material";
// import { useDropzone } from "react-dropzone";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// const FileUpload = ({ onUpload, value, label, category = "others" }) => {
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   // Explicitly type the ref
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Handle drop of files
//   const onDrop = (acceptedFiles) => {
//     const selectedFile = acceptedFiles[0];
//     if (selectedFile) {
//       handleFileUpload(selectedFile);
//     }
//   };

//   // Handle file selection from file picker
//   const handleFileChange = async (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       handleFileUpload(selectedFile);
//     }
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
//           onUploadProgress: (progressEvent: any) => {
//             const percent = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setProgress(percent);
//           },
//         }
//       );

//       const uploadedImageUrl = response.data.filePath;
//       onUpload(uploadedImageUrl); // Send URL to parent (form)
//     } catch (error) {
//       console.error("Upload error:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Trigger file input on Change Image button click
//   const handleChangeImage = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click(); // Trigger file input click programmatically
//     }
//   };

//   // React Dropzone hook
//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     multiple: false,
//     accept: {
//       "image/*": [],
//     },
//   });

//   return (
//     <Box
//       sx={{ textAlign: "center", width: "100%", maxWidth: 400, margin: "auto" }}
//     >
//       {!value && (
//         <>
//           <Typography variant="h6" gutterBottom>
//             Upload {label}
//           </Typography>

//           <Paper
//             {...getRootProps()}
//             sx={{
//               padding: 3,
//               border: "2px dashed #1976d2",
//               backgroundColor: "#f0f0f0", // Gray background
//               cursor: "pointer",
//               textAlign: "center",
//               borderRadius: 2,
//               "&:hover": {
//                 backgroundColor: "#e3e3e3", // Lighter gray on hover
//               },
//             }}
//           >
//             <input {...getInputProps()} onChange={handleFileChange} />

//             <CloudUploadIcon color="primary" fontSize="large" />
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Drag & Drop a file here
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 or
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ color: "#1976d2", cursor: "pointer" }}
//               >
//                 Choose File
//               </Typography>
//             </Box>
//           </Paper>
//         </>
//       )}

//       {uploading && (
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="caption" color="text.secondary">
//             Uploading: {progress}%
//           </Typography>
//           <LinearProgress
//             variant="determinate"
//             value={progress}
//             sx={{
//               mt: 1,
//               borderRadius: 2,
//               height: "6px",
//               backgroundColor: "#f0f0f0",
//               "& .MuiLinearProgress-bar": {
//                 backgroundColor: "#1976d2",
//               },
//             }}
//           />
//         </Box>
//       )}

//       {value && (
//         <Box sx={{ mt: 2 }}>
//           <img
//             src={`${apiBaseUrl}${value}`}
//             alt="Uploaded"
//             width="150"
//             style={{
//               borderRadius: "8px",
//               marginBottom: "16px",
//               maxWidth: "100%",
//               objectFit: "cover",
//             }}
//           />
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{ mt: 1, display: "block" }}
//           >
//             {label}
//           </Typography>

//           <Button
//             variant="text"
//             sx={{
//               mt: 2,
//               color: "#1976d2",
//               textTransform: "none",
//               fontSize: "14px",
//               "&:hover": {
//                 backgroundColor: "transparent",
//                 textDecoration: "underline",
//               },
//             }}
//             onClick={handleChangeImage}
//           >
//             Change Image
//           </Button>
//         </Box>
//       )}

//       {/* Hidden file input to trigger via button click */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
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
import { Box, Typography, Paper, Button, LinearProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Example: replace this with your actual API base URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
      boxHeight = "120px";
      fontSize = "1rem";
      padding = 2;
  }

  return (
    <>
      {label && (
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: size === "small" ? "none" : "block" }}
        >
          Upload {label}
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

const UploadedPreview = ({ value, label, onChangeImage, size = "medium" }) => {
  let imageSize;
  switch (size) {
    case "small":
      imageSize = { width: 80, height: 80, borderRadius: "50%" }; // avatar
      break;
    case "large":
      imageSize = { width: 300, height: "auto", borderRadius: "8px" };
      break;
    case "banner":
      imageSize = { width: "100%", height: "auto", borderRadius: "8px" };
      break;
    default:
      imageSize = { width: 150, height: "auto", borderRadius: "8px" };
  }

  return (
    <Box sx={{ mt: 2, textAlign: "center" }}>
      <img
        src={`${apiBaseUrl}${value}`}
        alt="Uploaded"
        style={{
          ...imageSize,
          marginBottom: "16px",
          objectFit: "cover",
        }}
      />
      <Typography variant="body2" color="text.secondary">
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
        onClick={onChangeImage}
      >
        Change Image
      </Button>
    </Box>
  );
};

const FileUpload = ({
  onUpload,
  value,
  label = "",
  category = "others",
  size = "medium",
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg",
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) handleFileUpload(selectedFile);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) handleFileUpload(selectedFile);
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const response = await axios.post(
        `${apiBaseUrl}api/media/upload/${category}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );
      const uploadedImageUrl = response.data.filePath;
      onUpload(uploadedImageUrl);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    // accept: { "image/*": [] },
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
  });

  return (
    <Box
      sx={{ textAlign: "center", width: "100%", maxWidth: 400, margin: "auto" }}
    >
      {!value && !uploading && (
        <UploadPlaceholder
          label={label}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          handleFileChange={handleFileChange}
        />
      )}

      {uploading && <UploadProgress progress={progress} />}

      {value && !uploading && (
        <UploadedPreview
          value={value}
          label={label}
          onChangeImage={handleChangeImage}
          size={size}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        // accept="image/*"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default FileUpload;
