import React, { useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import {
  Accept,
  DropzoneOptions,
  FileRejection,
  useDropzone,
} from "react-dropzone";
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // For "Change" button icon
import { FileObject } from "@/shared/types/common";

// Example: replace this with your actual API base URL
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

// --- Compact Upload Placeholder ---
// Remove getRootProps and getInputProps from here
const CompactUploadPlaceholder = ({
  label,
  handleFileChange, // This handleFileChange is for the internal input if used, or for dropzone
  accept,
  sx = {}, // Allow custom styles
}: {
  label: any;
  handleFileChange: any;
  accept: any;
  sx?: {} | undefined;
}) => {
  const isImageOnly = accept.includes("image/");
  const isDocumentOnly =
    !isImageOnly &&
    (accept.includes(".pdf") ||
      accept.includes(".doc") ||
      accept.includes(".docx"));

  return (
    // Use a React Fragment to return multiple top-level elements
    <>
      {label && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5, lineHeight: "normal" }}
        >
          {label}
        </Typography>
      )}
      <Paper
        // Removed getRootProps and getInputProps from here to avoid conflicts
        // The main FileUpload1 component will handle the dropzone globally
        // This component is now purely visual for the "Choose" button
        variant="outlined"
        sx={{
          p: 0.5,
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px dashed #9e9e9e",
          backgroundColor: "#fff",
          cursor: "pointer", // Still indicate clickability
          borderRadius: 1,
          "&:hover": { borderColor: "#1976d2", backgroundColor: "#f5f5f5" },
          width: "100%",
          boxSizing: "border-box",
          ...sx,
        }}
      >
        {/* The hidden input is now managed by the parent FileUpload1 */}
        {/* This button will trigger the parent's file input click directly */}
        <Box display="flex" alignItems="center" sx={{ ml: 1 }}>
          {isImageOnly ? (
            <PhotoCameraIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
          ) : isDocumentOnly ? (
            <InsertDriveFileIcon
              color="action"
              fontSize="small"
              sx={{ mr: 0.5 }}
            />
          ) : (
            <CloudUploadIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.875rem" }}
          >
            {label || "Upload File"}
          </Typography>
        </Box>
        {/* This button will now directly call handleFileChange (which calls handleChangeFile on parent) */}
        <Button
          variant="text"
          size="small"
          sx={{ textTransform: "none", mr: 1 }}
          onClick={handleFileChange} // Use the passed handleFileChange
        >
          Choose
        </Button>
      </Paper>
    </>
  );
};

// --- Upload Progress ---
const UploadProgress = ({
  progress,
  sx = {},
}: {
  progress: any;
  sx?: {} | undefined;
}) => (
  <Box sx={{ width: "100%", mt: 0.5, ...sx }}>
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        borderRadius: 2,
        height: "6px",
        backgroundColor: "#e0e0e0",
        "& .MuiLinearProgress-bar": { backgroundColor: "#1976d2" },
      }}
    />
    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
      Uploading: {progress}%
    </Typography>
  </Box>
);

// --- Uploaded File/Image Preview (Compact) ---
const CompactUploadedPreview = ({
  value,
  label,
  onChangeFile, // This will be handleChangeFile from parent
  onRemoveFile,
  fileType = "document",
  sx = {},
}: {
  value: any;
  label: any;
  onChangeFile: any;
  onRemoveFile: any;
  fileType?: string | undefined;
  sx?: {} | undefined;
}) => {
  // Extract filename from key, removing timestamp prefix if present
  // Key format: "Trip Detail Docs/1762673796889-Airops-AOQT-25-0060-1.pdf"
  // We want: "Airops-AOQT-25-0060-1.pdf"
  const getFileName = (fileObject: any): string => {
    if (!fileObject) return "";

    // If value is a string (URL), try to extract from URL
    if (typeof fileObject === "string") {
      return fileObject.split("/").pop() || "";
    }

    // If value is an object with key
    if (fileObject.key) {
      const fullPath = fileObject.key;
      const fileName = fullPath.split("/").pop() || "";
      // Remove timestamp prefix if present (format: timestamp-filename)
      // Match pattern: digits-filename
      const match = fileName.match(/^\d+-(.+)$/);
      return match ? match[1] : fileName;
    }

    // Fallback: try to get from URL
    if (fileObject.url) {
      return fileObject.url.split("/").pop() || "";
    }

    return "";
  };

  const fileName = getFileName(value);

  const handleDownload = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    e.stopPropagation();
    // window.open(`${apiBaseUrl}${value}`, "_blank");
    // ⭐️ CHANGE 3: Use value.url directly for download
    if (value?.url) {
      window.open(value.url, "_blank");
    }
  };

  return (
    <>
      {label && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5, lineHeight: "normal" }}
        >
          {label}
        </Typography>
      )}
      <Paper
        variant="outlined"
        sx={{
          p: 0.5,
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #e0e0e0",
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          width: "100%",
          boxSizing: "border-box",
          ...sx,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{ ml: 1, flexGrow: 1, minWidth: 0 }}
        >
          {fileType === "image" ? (
            <PhotoCameraIcon
              color="primary"
              fontSize="small"
              sx={{ mr: 0.5 }}
            />
          ) : (
            <InsertDriveFileIcon
              color="primary"
              fontSize="small"
              sx={{ mr: 0.5 }}
            />
          )}
          <Tooltip title={fileName}>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "0.875rem",
              }}
            >
              {fileName}
            </Typography>
          </Tooltip>
        </Box>
        <Box display="flex" alignItems="center">
          {value && (
            <Tooltip title="Download File">
              <IconButton onClick={handleDownload} size="small">
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Change File">
            <IconButton onClick={onChangeFile} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove File">
            <IconButton onClick={onRemoveFile} size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </>
  );
};

// --- Main FileUpload Component ---
const MediaUpload = ({
  onUpload,
  value,
  label = "", // Used as placeholder text now
  category = "others",
  size = "medium", // 'small' for avatar, 'medium' for compact form fields, 'large' for full component
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg",
}: {
  onUpload: (fileObject: FileObject | null) => void;
  value: FileObject | null | undefined; // Keep original type - only FileObject
  label?: string;
  category?: string;
  size?: "small" | "medium" | "large";
  accept?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Define fileInputRef once at the top of the main component
  // It should be outside all conditional rendering blocks
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if the accepted types are primarily for images
  const isImageAccept =
    accept.includes("image/") ||
    accept.includes(".png") ||
    accept.includes(".jpg") ||
    accept.includes(".jpeg") ||
    accept.includes(".gif");
  const fileType = isImageAccept ? "image" : "document";

  // const onDrop = (acceptedFiles) => {
  //   const selectedFile = acceptedFiles[0];
  //   if (selectedFile) handleFileUpload(selectedFile);
  // };

  const onDrop: DropzoneOptions["onDrop"] = (acceptedFiles, fileRejections) => {
    // Note: We often omit the 'event' parameter here since it's rarely used
    // and simplifies the signature. TypeScript will still match it correctly
    // because the resulting function type is derived from DropzoneOptions.

    const selectedFile = acceptedFiles[0];
    if (selectedFile) handleFileUpload(selectedFile);

    // You can handle file rejections here if needed
    if (fileRejections.length > 0) {
      console.error("File rejected:", fileRejections[0].errors);
    }
  };

  // This handleFileChange is primarily for the hidden input onChange
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target?.files?.[0];
    if (selectedFile) handleFileUpload(selectedFile);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear input for re-upload
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setProgress(0);
    try {
      const response = await axios.post(
        `${apiBaseUrl}api/media/upload/${category}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total ?? 0; // fallback if undefined
            if (total > 0) {
              const percent = Math.round((progressEvent.loaded * 100) / total);
              setProgress(percent);
            } else {
              // Handle unknown total size (optional)
              setProgress(0); // or keep previous progress
            }
          },
        }
      );
      // const uploadedFilePath = response.data.filePath;
      // onUpload(uploadedFilePath);

      const uploadedFileObject: FileObject = response.data;
      onUpload(uploadedFileObject);
    } catch (error) {
      console.error("Upload error:", error);
      // You might show a snackbar here
    } finally {
      setUploading(false);
    }
  };

  // This function will be passed to children to trigger the hidden input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    onUpload(null); // Clear the value
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,

    accept: accept.split(",").reduce<Accept>(
      (acc, type) => {
        const mime = type.trim();

        if (!mime) return acc; // skip empty

        if (mime.startsWith(".")) {
          // Map extensions to MIME
          if (mime === ".pdf") acc["application/pdf"] = [];
          else if (mime === ".doc") acc["application/msword"] = [];
          else if (mime === ".docx")
            acc[
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ] = [];
          else if (mime === ".png") acc["image/png"] = [];
          else if (mime === ".jpg" || mime === ".jpeg") acc["image/jpeg"] = [];
          else if (mime === ".gif") acc["image/gif"] = [];
        } else if (mime === "image/*") {
          acc["image/png"] = [];
          acc["image/jpeg"] = [];
          acc["image/gif"] = [];
          acc["image/bmp"] = [];
          acc["image/webp"] = [];
        } else {
          acc[mime] = [];
        }

        return acc;
      },
      {} // ✅ initial value prevents 'undefined'
    ),
  });

  // --- Render based on size prop ---
  return (
    <Box>
      {" "}
      {/* Wrap the whole component in a Box to contain the hidden input */}
      {size === "small" && (
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid #ddd",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!value && !uploading && (
            <Box
              {...getRootProps({
                // Keep dropzone functionality here for the initial upload
                onClick: triggerFileInput, // Also trigger file input on click (redundant but safe)
              })}
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <PhotoCameraIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
            </Box>
          )}
          {uploading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
            >
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ width: "80%", borderRadius: 2, height: 4 }}
              />
              <Typography variant="caption" color="text.secondary" mt={0.5}>
                {progress}%
              </Typography>
            </Box>
          )}
          {value && !uploading && (
            <>
              <img
                // src={`${apiBaseUrl}${value}`}
                src={value.url}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "white",
                  cursor: "pointer",
                  py: 0.5,
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                }}
                onClick={triggerFileInput} // Use the new triggerFileInput
              >
                <PhotoCameraIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Change
              </Box>
            </>
          )}
        </Box>
      )}
      {size === "medium" && (
        <Box sx={{ width: "100%", textAlign: "left" }}>
          {!value && !uploading && (
            <Box {...getRootProps()}>
              {" "}
              {/* Apply dropzone to the whole placeholder */}
              <CompactUploadPlaceholder
                label={label}
                handleFileChange={triggerFileInput} // Pass triggerFileInput to "Choose" button
                accept={accept}
                // getRootProps and getInputProps are no longer needed here
              />
            </Box>
          )}
          {uploading && <UploadProgress progress={progress} />}
          {value && !uploading && (
            <CompactUploadedPreview
              value={value} // Pass the full FileObject (with key and url)
              label={label}
              onChangeFile={triggerFileInput} // Pass triggerFileInput to "Change" icon
              onRemoveFile={handleRemoveFile}
              fileType={fileType}
            />
          )}
        </Box>
      )}
      {size === "large" && (
        <Box
          sx={{
            textAlign: "center",
            width: "100%",
            maxWidth: 400,
            margin: "auto",
          }}
        >
          {!value && !uploading && (
            <>
              {label && (
                <Typography variant="h6" gutterBottom>
                  Upload {label}
                </Typography>
              )}
              <Paper
                {...getRootProps({
                  // Apply dropzone to the whole paper
                  onClick: triggerFileInput, // Also trigger file input on click (redundant but safe)
                })}
                sx={{
                  padding: 2,
                  height: 120,
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
                <Box textAlign="center">
                  <CloudUploadIcon
                    color="primary"
                    fontSize="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Drag & Drop or{" "}
                    <span style={{ color: "#1976d2", cursor: "pointer" }}>
                      Choose File
                    </span>
                  </Typography>
                </Box>
              </Paper>
            </>
          )}
          {uploading && <UploadProgress progress={progress} />}
          {value && !uploading && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              {(() => {
                const fileName = value ? value?.key.split("/").pop() : "";
                const handleDownload = (
                  e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
                ) => {
                  e.stopPropagation();
                  // window.open(`${apiBaseUrl}${value}`, "_blank");
                  if (value?.url) window.open(value.url, "_blank");
                };

                return fileType === "image" ? (
                  <img
                    // src={`${apiBaseUrl}${value}`}
                    src={value.url}
                    alt="Uploaded"
                    style={{
                      width: 150,
                      height: "auto",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Paper
                    sx={{
                      p: 1.5,
                      width: "100%",
                      maxWidth: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      backgroundColor: "#fff",
                      margin: "auto",
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <InsertDriveFileIcon color="action" sx={{ mr: 1 }} />
                      <Tooltip title={fileName}>
                        <Typography
                          variant="body2"
                          sx={{
                            flexGrow: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {fileName}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <IconButton onClick={handleDownload} size="small">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                );
              })()}

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
                onClick={triggerFileInput} // Use the new triggerFileInput
              >
                Change {fileType === "image" ? "Image" : "File"}
              </Button>
              <Button
                variant="text"
                color="error"
                sx={{
                  mt: 2,
                  ml: 1,
                  textTransform: "none",
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
                onClick={handleRemoveFile}
              >
                Remove
              </Button>
            </Box>
          )}
        </Box>
      )}
      {/* Hidden file input - ALWAYS RENDER THIS */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept} // Use the accept prop here
        onChange={handleFileChange} // Use the local handleFileChange for the actual file input event
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default MediaUpload;
