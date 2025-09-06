import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

// 👇 Import worker correctly using Vite syntax
import PdfWorker from "pdfjs-dist/build/pdf.worker?worker";
import { UserAvatar } from "./UserAvatar";

pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker(); // ✅ Use workerPort instead of workerSrc

interface Doc {
  name: string;
  department?: string;
  attachment: string;
  createdBy?: any;
}

interface Props {
  doc: Doc;
  onClick: (doc: Doc) => void;
  handleMenuClick: (event: React.MouseEvent, doc: Doc) => void;
}

const PdfThumbnailCard: React.FC<Props> = ({
  doc,
  onClick,
  handleMenuClick,
}) => {
  const url = `${apiBaseUrl}/${doc.attachment}`;
  const isPDF = doc.attachment.toLowerCase().endsWith(".pdf");

  return (
    // <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
    //   <Box
    //     sx={{
    //       height: 150,
    //       bgcolor: "#e0e0e0",
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "flex-start",
    //       overflow: "hidden",
    //     }}
    //   >
    //     {isPDF ? (
    //       <Document
    //         file={url}
    //         onLoadError={(err) => console.error("PDF load error", err)}
    //         loading={<Typography variant="caption">Loading PDF...</Typography>}
    //       >
    //         <Page
    //           pageNumber={1}
    //           width={180}
    //           renderAnnotationLayer={false}
    //           renderTextLayer={false}
    //         />
    //       </Document>
    //     ) : (
    //       <Box
    //         component="img"
    //         src={doc.attachment}
    //         alt="Preview"
    //         sx={{ height: "100%", width: "auto", objectFit: "cover" }}
    //       />
    //     )}
    //   </Box>

    //   <CardContent
    //     sx={{
    //       p: 1.5,
    //       pt: 1,
    //       display: "flex",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //     }}
    //   >
    //     {/* Left content (icon + text) */}
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "column",
    //         flex: 1,
    //         overflow: "hidden",
    //       }}
    //     >
    //       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    //         {/* <PictureAsPdfIcon fontSize="small" color="error" /> */}
    //         <UserAvatarCell
    //           user={
    //             doc.createdBy
    //               ? {
    //                   ...doc.createdBy,
    //                   name:
    //                     doc?.createdBy?.displayName || doc?.createdBy?.fullName,
    //                   profilePicUrl: `${apiBaseUrl}${doc?.createdBy?.profile}`,
    //                 }
    //               : null
    //           }
    //         />
    //         <Typography
    //           variant="subtitle2"
    //           fontWeight={600}
    //           noWrap
    //           sx={{ flex: 1, fontSize: "0.875rem" }}
    //         >
    //           {doc.name}
    //         </Typography>
    //       </Box>
    //       <Typography
    //         variant="caption"
    //         color="text.secondary"
    //         noWrap
    //         sx={{ ml: 4, fontSize: "0.75rem" }}
    //       >
    //         Department: {doc.department}
    //       </Typography>
    //     </Box>

    //     {/* Menu button */}
    //     <IconButton
    //       aria-label="actions"
    //       onClick={(event) => handleMenuClick(event, doc)}
    //       size="small"
    //       sx={{ ml: 1 }}
    //     >
    //       <MoreVertIcon fontSize="small" />
    //     </IconButton>
    //   </CardContent>
    // </Card>

    // <Card
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     height: "100%", // Fill parent height
    //     minHeight: 0, // Allow shrinking
    //     boxShadow: 2,
    //     borderRadius: 2,
    //   }}
    // >
    //   {/* Header: Minimized height and padding */}
    //   <Box
    //     sx={{
    //       display: "flex",
    //       alignItems: "center",
    //       px: 0.5, // Minimal horizontal padding
    //       py: 0.2, // Minimal vertical padding
    //       justifyContent: "space-between",
    //       bgcolor: "#f5f5f5",
    //       minHeight: "28px", // Small header height
    //     }}
    //   >
    //     <Box
    //       sx={{
    //         display: "flex",
    //         alignItems: "center",
    //         gap: 0.5,
    //         overflow: "hidden",
    //       }}
    //     >
    //       <DescriptionIcon color="primary" sx={{ fontSize: "1rem" }} />
    //       <Typography
    //         variant="body2"
    //         fontWeight={600}
    //         noWrap
    //         sx={{ fontSize: "0.75rem" }} // Small font
    //       >
    //         {doc.name}
    //       </Typography>
    //     </Box>
    //     <IconButton
    //       aria-label="actions"
    //       onClick={(event) => handleMenuClick(event, doc)}
    //       size="small"
    //     >
    //       <MoreVertIcon fontSize="small" />
    //     </IconButton>
    //   </Box>
    //   {/* Main: Large thumbnail or PDF preview */}
    //   <Box
    //     sx={{
    //       flexGrow: 1,
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //       minHeight: 0, // Allow to shrink/grow
    //       p: 0.5, // Minimal padding
    //       overflow: "hidden",
    //     }}
    //     onClick={() => onClick(doc)}
    //   >
    //     {isPDF ? (
    //       <Document
    //         file={url}
    //         onLoadError={(err) => console.error("PDF load error", err)}
    //         loading={
    //           <Typography variant="caption" sx={{ color: "text.secondary" }}>
    //             Loading PDF...
    //           </Typography>
    //         }
    //       >
    //         <Page
    //           pageNumber={1}
    //           width={220} // Increased thumbnail size if desired
    //           renderAnnotationLayer={false}
    //           renderTextLayer={false}
    //         />
    //       </Document>
    //     ) : (
    //       <Box
    //         component="img"
    //         src={doc.attachment}
    //         alt="Preview"
    //         sx={{
    //           maxHeight: "140px", // Show larger preview as possible
    //           width: "auto",
    //           objectFit: "contain",
    //         }}
    //       />
    //     )}
    //   </Box>
    //   {/* Footer: Minimized height and padding */}
    //   {/* <CardContent
    //     sx={{
    //       px: 0.5,
    //       py: 0.1,
    //       display: "flex",
    //       justifyContent: "flex-start",
    //       alignItems: "center",
    //       bgcolor: "#f5f5f5",
    //       gap: 0.5,
    //       minHeight: "22px",
    //     }}
    //   >
    //     <UserAvatar
    //       user={
    //         doc.createdBy
    //           ? {
    //               ...doc.createdBy,
    //               name: doc?.createdBy?.displayName || doc?.createdBy?.fullName,
    //               profilePicUrl: `${apiBaseUrl}${doc?.createdBy?.profile}`,
    //             }
    //           : null
    //       }
    //     />
    //     <Typography
    //       variant="body2"
    //       color="text.secondary"
    //       noWrap
    //       sx={{ fontSize: "0.72rem" }} // Smaller footer text
    //     >
    //       {doc.department}
    //     </Typography>
    //   </CardContent> */}
    //   <Box
    //     sx={{
    //       display: "flex",
    //       alignItems: "center",
    //       px: 0.5,
    //       py: 0.1,
    //       bgcolor: "#f5f5f5",
    //       gap: 0.5,
    //       minHeight: "22px",
    //     }}
    //   >
    //     <UserAvatar
    //       user={
    //         doc.createdBy
    //           ? {
    //               ...doc.createdBy,
    //               name: doc?.createdBy?.displayName || doc?.createdBy?.fullName,
    //               profilePicUrl: `${apiBaseUrl}${doc?.createdBy?.profile}`,
    //             }
    //           : null
    //       }
    //     />
    //     <Typography
    //       variant="body2"
    //       color="text.secondary"
    //       noWrap
    //       sx={{ fontSize: "0.72rem" }}
    //     >
    //       {doc.department}
    //     </Typography>
    //   </Box>
    // </Card>

    // <Card
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     height: "100%",
    //     minHeight: 0,
    //     // Add a subtle box shadow and a larger border radius for a softer look
    //     boxShadow: 2, // Retain the existing shadow level
    //     borderRadius: 3, // Increase border radius to match the 'Resume' card's rounded edges
    //   }}
    // >
    //   {/* Header: Maintain a consistent gray background */}
    //   <Box
    //     sx={{
    //       display: "flex",
    //       alignItems: "center",
    //       // Add more padding to the left and right, as well as top and bottom
    //       px: 1.5,
    //       py: 1.5,
    //       justifyContent: "space-between",
    //       // Re-add the light gray background color
    //       bgcolor: "#f5f5f5",
    //       minHeight: "28px",
    //       // Apply border-radius only to the top corners
    //       borderTopLeftRadius: 12,
    //       borderTopRightRadius: 12,
    //     }}
    //   >
    //     <Box
    //       sx={{
    //         display: "flex",
    //         alignItems: "center",
    //         gap: 1, // Increase gap for better spacing
    //         overflow: "hidden",
    //       }}
    //     >
    //       <DescriptionIcon color="primary" sx={{ fontSize: "1rem" }} />
    //       <Typography
    //         variant="body2"
    //         fontWeight={600}
    //         noWrap
    //         sx={{ fontSize: "0.875rem" }} // Use a slightly larger font size
    //       >
    //         {doc.name}
    //       </Typography>
    //     </Box>
    //     <IconButton
    //       aria-label="actions"
    //       onClick={(event) => handleMenuClick(event, doc)}
    //       size="small"
    //     >
    //       <MoreVertIcon fontSize="small" />
    //     </IconButton>
    //   </Box>
    //   {/* Main Content: The central part of the card */}
    //   <Box
    //     sx={{
    //       flexGrow: 1,
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //       minHeight: 0,
    //       p: 1.5, // Add padding around the central content
    //       overflow: "hidden",
    //     }}
    //     onClick={() => onClick(doc)}
    //   >
    //     {isPDF ? (
    //       <Document
    //         file={url}
    //         onLoadError={(err) => console.error("PDF load error", err)}
    //         loading={
    //           <Typography variant="caption" sx={{ color: "text.secondary" }}>
    //             Loading PDF...
    //           </Typography>
    //         }
    //       >
    //         <Page
    //           pageNumber={1}
    //           width={220}
    //           renderAnnotationLayer={false}
    //           renderTextLayer={false}
    //         />
    //       </Document>
    //     ) : (
    //       <Box
    //         component="img"
    //         src={doc.attachment}
    //         alt="Preview"
    //         sx={{
    //           maxHeight: "140px",
    //           width: "auto",
    //           objectFit: "contain",
    //         }}
    //       />
    //     )}
    //   </Box>
    //   {/* Footer: Maintain a consistent gray background and compact spacing */}
    //   <Box
    //     sx={{
    //       display: "flex",
    //       alignItems: "center",
    //       // Adjust padding to be compact, but still provide space
    //       px: 1.5,
    //       py: 1,
    //       // Use the same light gray background color
    //       bgcolor: "#f5f5f5",
    //       gap: 0.5,
    //       // Restore a more compact minimum height
    //       minHeight: "28px",
    //       // Apply border-radius only to the bottom corners
    //       borderBottomLeftRadius: 12,
    //       borderBottomRightRadius: 12,
    //     }}
    //   >
    //     <UserAvatar
    //       user={
    //         doc.createdBy
    //           ? {
    //               ...doc.createdBy,
    //               name: doc?.createdBy?.displayName || doc?.createdBy?.fullName,
    //               profilePicUrl: `${apiBaseUrl}${doc?.createdBy?.profile}`,
    //             }
    //           : null
    //       }
    //     />
    //     <Typography
    //       variant="body2"
    //       color="text.secondary"
    //       noWrap
    //       sx={{ fontSize: "0.72rem" }}
    //     >
    //       {doc.department}
    //     </Typography>
    //   </Box>
    // </Card>

    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        boxShadow: 2,
        borderRadius: 3,
      }}
    >
      {/* Header: Reduced padding for a more compact header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // Reduced horizontal and vertical padding
          px: 1,
          py: 0.5,
          justifyContent: "space-between",
          bgcolor: "#f5f5f5",
          minHeight: "28px",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            // Reduced gap for a tighter fit
            gap: 0.5,
            overflow: "hidden",
          }}
        >
          <DescriptionIcon color="primary" sx={{ fontSize: "1rem" }} />
          <Typography
            variant="body2"
            fontWeight={600}
            noWrap
            sx={{ fontSize: "0.875rem" }}
          >
            {doc.name}
          </Typography>
        </Box>
        <IconButton
          aria-label="actions"
          onClick={(event) => handleMenuClick(event, doc)}
          size="small"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Main Content: The central part of the card */}
      <Box
        // sx={{
        //   flexGrow: 1,
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   minHeight: 0,
        //   // Reduced padding around the main content
        //   p: 1,
        //   overflow: "hidden",
        // }}
        sx={{
          height: 150,
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "hidden",
        }}
        onClick={() => onClick(doc)}
      >
        {isPDF ? (
          <Document
            file={url}
            onLoadError={(err) => console.error("PDF load error", err)}
            loading={
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Loading PDF...
              </Typography>
            }
          >
            <Page
              pageNumber={1}
              width={200}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        ) : (
          <Box
            component="img"
            src={doc.attachment}
            alt="Preview"
            sx={{
              maxHeight: "140px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        )}
      </Box>
      {/* Footer: Reduced padding for a more compact footer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // Reduced horizontal and vertical padding
          px: 1,
          py: 0.5,
          bgcolor: "#f5f5f5",
          // Reduced gap for a tighter fit
          gap: 0.5,
          // Reduced minHeight for a more compact footer
          minHeight: "24px",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <UserAvatar
          user={
            doc.createdBy
              ? {
                  ...doc.createdBy,
                  name: doc?.createdBy?.displayName || doc?.createdBy?.fullName,
                  profilePicUrl: `${apiBaseUrl}${doc?.createdBy?.profile}`,
                }
              : null
          }
        />
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ fontSize: "0.72rem" }}
        >
          {doc.department}
        </Typography>
      </Box>
    </Card>
  );
};

export default PdfThumbnailCard;
