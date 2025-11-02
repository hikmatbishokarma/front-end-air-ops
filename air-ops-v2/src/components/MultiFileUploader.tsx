// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   IconButton,
//   Typography,
//   LinearProgress,
//   Paper,
// } from "@mui/material";
// import { useDropzone } from "react-dropzone";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// const MultiFileUpload = ({
//   value = [],
//   onUpload,
//   label,
//   category = "others",
//   onChange,
// }) => {
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const onDrop = async (acceptedFiles) => {
//     for (const file of acceptedFiles) {
//       await handleFileUpload(file);
//     }
//   };

//   const handleFileUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     setUploading(true);

//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/media/uploads/${category}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },

//           onUploadProgress: (event: any) => {
//             if (event.lengthComputable) {
//               const percent = Math.round((event.loaded * 100) / event.total);
//               setProgress(percent);
//             }
//           },
//         }
//       );

//       const uploadedImageUrl = response.data.filePath;
//       onUpload(uploadedImageUrl); // Add image to form field
//     } catch (error) {
//       console.error("Upload error:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDelete = async (url) => {
//     const filename = url.split("/").pop();

//     try {
//       await axios.delete(`http://localhost:3000/api/media/delete/${category}`, {
//         params: { filename },
//       });

//       const updatedValue = value.filter((v) => v !== url);
//       onChange(updatedValue); // Update form field
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     multiple: true,
//     accept: { "image/*": [] },
//   });

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Upload {label}
//       </Typography>

//       <Paper
//         {...getRootProps()}
//         sx={{
//           padding: 3,
//           border: "2px dashed #1976d2",
//           backgroundColor: "#f9f9f9",
//           cursor: "pointer",
//           textAlign: "center",
//           borderRadius: 2,
//         }}
//       >
//         <input {...getInputProps()} />
//         <CloudUploadIcon color="primary" fontSize="large" />
//         <Typography variant="body2" color="text.secondary">
//           Drag & Drop or Click to Upload
//         </Typography>
//       </Paper>

//       {uploading && (
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="caption" color="text.secondary">
//             Uploading: {progress}%
//           </Typography>
//           <LinearProgress
//             variant="determinate"
//             value={progress}
//             sx={{ mt: 1 }}
//           />
//         </Box>
//       )}

//       <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
//         {value?.map((img, index) => (
//           <Box key={index} position="relative">
//             <img
//               src={`http://localhost:3000/${img}`}
//               alt=""
//               width={100}
//               style={{ borderRadius: 8 }}
//             />
//             <IconButton
//               size="small"
//               sx={{ position: "absolute", top: 0, right: 0 }}
//               onClick={() => handleDelete(img)}
//             >
//               <DeleteIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default MultiFileUpload;

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

const MultiFileUpload = ({
  value = [], // Array of image URLs
  onUpload, // Adds new URL to RHF state
  onChange, // Updates RHF state after deletion
  label, // e.g., "Media" or "Bus Images"
  category = "others", // API upload category
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- API Handlers ---

  const handleFileUpload = async (file) => {
    if (value.length >= MAX_FILES) {
      console.warn(`Upload limit reached (${MAX_FILES} images).`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/media/uploads/${category}`,
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

      const uploadedImageUrl = response.data.filePath;
      onUpload(uploadedImageUrl); // Call parent handler to update RHF state
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (url) => {
    const filename = url.split("/").pop();

    try {
      await axios.delete(`http://localhost:3000/api/media/delete/${category}`, {
        params: { filename },
      });

      const updatedValue = value.filter((v) => v !== url);
      onChange(updatedValue); // Call parent handler to update RHF state
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // const onDrop = async (acceptedFiles, fileRejections) => {
  //   if (fileRejections.length > 0) {
  //     console.error("File rejection details:", fileRejections);
  //   }
  //   for (const file of acceptedFiles) {
  //     await handleFileUpload(file);
  //   }
  // };

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    await handleBatchFileUpload(acceptedFiles); // Call a new batch handler
  };

  const handleBatchFileUpload = async (files) => {
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
        `http://localhost:3000/api/media/uploads/${category}`,
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

      // ⭐️ Key Change: Server should return an array of paths: { filePaths: ['path1', 'path2'] }

      // console.log("response.data:::", response.data);
      // const uploadedImageUrls = response.data.filePaths;

      // console.log("uploadedImageUrls:::", uploadedImageUrls);

      // // Call parent handler (onUpload) for EACH uploaded URL
      // uploadedImageUrls.forEach((url) => onUpload(url));

      // Server returns: { filePaths: ['path1', 'path2'] }
      const uploadedImageUrls = response.data.filePaths;

      // ⭐️ Key Fix: Aggregate the new array with the existing value prop
      // The value prop is guaranteed to be an array (due to value = [])
      const updatedFormValue = [...value, ...uploadedImageUrls];

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

  // const renderImageThumbnail = (url, index, isMain = false) => (
  //   <Grid
  //     item
  //     xs={12}
  //     sm={4}
  //     md={3}
  //     lg={2}
  //     key={`uploaded-${index}`}
  //     sx={{ minWidth: 120 }}
  //   >
  //     <Box
  //       position="relative"
  //       sx={{
  //         width: "100%",
  //         pt: "66.66%", // Aspect ratio 3:2
  //         overflow: "hidden",
  //         borderRadius: 2,
  //         boxShadow: isMain ? "0 4px 10px rgba(0,0,0,0.1)" : "none",
  //         border: isMain ? "2px solid #3f51b5" : "1px solid #ddd",
  //       }}
  //     >
  //       <img
  //         src={`http://localhost:3000/${url}`}
  //         alt={`Uploaded image ${index + 1}`}
  //         style={{
  //           position: "absolute",
  //           top: 0,
  //           left: 0,
  //           width: "100%",
  //           height: "100%",
  //           objectFit: "cover",
  //         }}
  //       />
  //       {/* Delete Button */}
  //       <IconButton
  //         size="small"
  //         sx={{
  //           position: "absolute",
  //           top: 4,
  //           right: 4,
  //           backgroundColor: "rgba(255, 255, 255, 0.7)",
  //           "&:hover": { backgroundColor: "white" },
  //           p: 0.5,
  //         }}
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           handleDelete(url);
  //         }}
  //       >
  //         <CloseIcon fontSize="small" sx={{ color: "#F7893B" }} />
  //       </IconButton>

  //       {/* Main Image Label */}
  //       {isMain && (
  //         <Box
  //           sx={{
  //             position: "absolute",
  //             bottom: 8,
  //             left: 8,
  //             backgroundColor: "white",
  //             borderRadius: 1,
  //             px: 1,
  //             py: 0.5,
  //             fontSize: "0.75rem",
  //             fontWeight: 600,
  //           }}
  //         >
  //           Main image
  //         </Box>
  //       )}
  //     </Box>
  //     {/* Generic Label */}
  //     <Typography
  //       variant="caption"
  //       align="center"
  //       display="block"
  //       sx={{ mt: 1, fontWeight: 600 }}
  //     >
  //       {`Image ${index + 1}`}
  //     </Typography>
  //   </Grid>
  // );

  // const renderImageThumbnail = (url, index, isMain = false) => (
  //   <Grid
  //     item
  //     xs={12}
  //     sm={4}
  //     md={3}
  //     lg={2}
  //     key={`uploaded-${index}`}
  //     sx={{ minWidth: 120 }}
  //   >
  //     <Box
  //       position="relative"
  //       sx={{
  //         width: "100%",
  //         pt: "66.66%", // Aspect ratio 3:2 (or adjust to 1:1 if preferred)
  //         overflow: "hidden",
  //         borderRadius: 2, // Rounded corners for the thumbnail box

  //         // ⭐️ KEY CHANGE: Consistent, subtle styling for ALL images
  //         boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Soft shadow
  //         border: "1px solid #ddd", // Subtle border

  //         // Remove the specific blue border logic:
  //         // border: isMain ? "2px solid #3f51b5" : "1px solid #ddd",
  //       }}
  //     >
  //       <img
  //         src={`http://localhost:3000/${url}`}
  //         alt={`Uploaded image ${index + 1}`}
  //         style={{
  //           position: "absolute",
  //           top: 0,
  //           left: 0,
  //           width: "100%",
  //           height: "100%",
  //           objectFit: "cover",
  //           borderRadius: 2, // Match border radius
  //         }}
  //       />

  //       {/* Delete Button (Retained) */}
  //       <IconButton
  //         size="small"
  //         sx={{
  //           position: "absolute",
  //           top: 4,
  //           right: 4,
  //           backgroundColor: "rgba(255, 255, 255, 0.7)",
  //           "&:hover": { backgroundColor: "white" },
  //           p: 0.5,
  //           zIndex: 10,
  //         }}
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           handleDelete(url);
  //         }}
  //       >
  //         <CloseIcon fontSize="small" sx={{ color: "#F7893B" }} />
  //       </IconButton>

  //       {/* 🛑 'Main Image Label' REMOVED completely as requested */}

  //       {/* If you want the label (like "Living room") overlaid on the image,
  //     you would move the <Typography> here and apply appropriate background/text styles.
  //     For now, we keep the simple style from Screenshot 2 (label below the image).
  //     */}
  //     </Box>
  //     {/* Generic Label (Image 1, Image 2, etc.) */}
  //     <Typography
  //       variant="caption"
  //       align="center"
  //       display="block"
  //       sx={{ mt: 1, fontWeight: 600 }}
  //     >
  //       {`Image ${index + 1}`}
  //     </Typography>
  //   </Grid>
  // );

  const renderImageThumbnail = (
    url,
    index // Removed isMain as it's not used
  ) => (
    <Grid
      item
      xs={12}
      sm={4}
      md={3}
      lg={2}
      key={`uploaded-${index}`}
      sx={{ minWidth: 120, position: "relative" }} // Ensure grid item is relative for positioning overlays
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
          src={`http://localhost:3000/${url}`}
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
            handleDelete(url);
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
      {/* 🛑 REMOVE the Typography that was below the image box */}
      {/*
    <Typography
      variant="caption"
      align="center"
      display="block"
      sx={{ mt: 1, fontWeight: 600 }}
    >
      {`Image ${index + 1}`}
    </Typography>
    */}
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

      {/* --- Image Gallery/Thumbnail Display --- */}
      <Grid container spacing={2}>
        {/* Render uploaded images */}
        {value?.map((img, index) => {
          const isMain = index === 0;
          return renderImageThumbnail(img, index, isMain);
        })}

        {/*
          No explicit placeholders are needed since the labels are generic ("Image X").
          The display focuses only on the actual uploaded images.
          If you wanted the placeholder boxes to appear empty up to 7 slots, we could add that back.
        */}
      </Grid>
    </Box>
  );
};

export default MultiFileUpload;
