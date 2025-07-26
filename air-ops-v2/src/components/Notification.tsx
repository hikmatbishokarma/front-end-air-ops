// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   List,
//   ListItem,
//   Avatar,
//   ListItemText,
//   Chip,
//   Button,
//   IconButton,
//   Tabs,
//   Tab,
//   Divider,
//   CircularProgress, // Added for loading state
// } from "@mui/material";
// import moment from "moment";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import CloseIcon from "@mui/icons-material/Close";
// import TagIcon from "@mui/icons-material/LocalOffer";
// import PersonIcon from "@mui/icons-material/Person";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import ReplyIcon from "@mui/icons-material/Reply";
// import { styled } from "@mui/system";

// // Import your Socket.IO client instance
// import socket from "../lib/socket"; // Adjust this path if your socket.ts is elsewhere (e.g., ../socket)
// import { GET_NOTIFICATIONS } from "../lib/graphql/queries/notifications";
// import useGql from "../lib/graphql/gql";
// import { useSnackbar } from "../SnackbarContext";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DocumentPreviewDialog from "./DocumentPreviewDialog";

// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// // --- Styled Components and Utility Functions ---

// const NotificationItemContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "flex-start",
//   padding: "16px 0",
//   borderBottom: "1px solid #e0e0e0",
//   "&:last-child": {
//     borderBottom: "none",
//   },
// }));

// const NotificationMeta = styled(Typography)(({ theme }) => ({
//   fontSize: "0.8rem",
//   color: theme.palette.text.secondary,
// }));

// const AvatarContainer = styled(Box)({
//   marginRight: "16px",
// });

// const ContentArea = styled(Box)({
//   flexGrow: 1,
// });

// const ActionArea = styled(Box)({
//   marginTop: "16px",
//   display: "flex",
//   gap: "8px",
// });

// const formatTimeDisplay = (timestamp) => {
//   if (!timestamp) return "";

//   // Handle MongoDB $date format if present, otherwise assume ISO string
//   const actualTimestamp =
//     typeof timestamp === "object" && timestamp.$date
//       ? timestamp.$date
//       : timestamp;

//   const notificationMoment = moment(actualTimestamp);
//   const now = moment();
//   const diffHours = now.diff(notificationMoment, "hours");

//   if (diffHours < 24) {
//     return notificationMoment.fromNow();
//   } else if (diffHours < 24 * 7) {
//     return notificationMoment.fromNow(true) + " ago";
//   } else if (now.year() === notificationMoment.year()) {
//     return notificationMoment.format("MMM D");
//   } else {
//     return notificationMoment.format("MMM D, YYYY");
//   }
// };

// // --- Notification Item Renderer (Flexible) ---
// // Now accepts onAccept and onDecline props
// const NotificationItem = ({
//   notification,
//   onAccept,
//   onDecline,
//   onPreviewDocument,
// }) => {
//   // Use _id for internal key if available, otherwise fallback to id or refId
//   const notificationId = notification._id || notification.id;

//   // Extract user info, favoring metadata for ACCESS_REQUEST
//   const userDisplayName =
//     notification.metadata?.requestedByName ||
//     notification.user ||
//     "Unknown User";
//   const userAvatarUrl =
//     `${apiBaseUrl}${notification.metadata?.userAvatar}` || "";

//   // Determine the status for rendering accept/decline buttons
//   // This assumes backend provides metadata.accessRequestStatus for ACCESS_REQUEST type
//   const accessRequestStatus =
//     notification.type === "ACCESS_REQUEST"
//       ? notification.metadata?.accessRequestStatus
//       : undefined;
//   const isPendingAccessRequest = accessRequestStatus === "PENDING"; // Assuming 'PENDING' from backend

//   // Determine the notification's read status
//   const isNotificationRead =
//     notification.isReadBy && notification.isReadBy.length > 0; // Simplified check

//   const renderMessage = () => {
//     switch (notification.type) {
//       case "tags_added":
//         return (
//           <Typography variant="body1">
//             <Box component="span" fontWeight="bold">
//               {userDisplayName}
//             </Box>{" "}
//             added new tags to 🔥{" "}
//             <Box component="span" fontWeight="bold">
//               {notification.projectName}
//             </Box>
//           </Typography>
//         );
//       case "ACCESS_REQUEST":
//         return (
//           <Typography variant="body1">
//             <Box component="span" fontWeight="bold">
//               {userDisplayName}
//             </Box>{" "}
//             requested access to{" "}
//             <Box component="span" fontWeight="bold">
//               {notification.metadata?.docType || "a document"}
//             </Box>
//           </Typography>
//         );
//       case "ACCESS_REQUEST_STATUS_UPDATE":
//         const requestStatus = notification.metadata?.status?.toLowerCase();
//         return (
//           <Typography variant="body1">
//             Your access request for{" "}
//             <Box component="span" fontWeight="bold">
//               {notification.metadata?.docType || "a document"}
//             </Box>{" "}
//             was{" "}
//             <Box
//               component="span"
//               fontWeight="bold"
//               color={
//                 requestStatus === "accepted" ? "success.main" : "error.main"
//               }
//             >
//               {requestStatus}
//             </Box>
//           </Typography>
//         );
//       case "mentioned":
//         return (
//           <Typography variant="body1">
//             <Box component="span" fontWeight="bold">
//               {userDisplayName}
//             </Box>{" "}
//             mentioned you in 💬{" "}
//             <Box component="span" fontWeight="bold">
//               {notification.projectName}
//             </Box>
//           </Typography>
//         );
//       default:
//         return (
//           <Typography variant="body1">
//             New notification from {userDisplayName}
//           </Typography>
//         );
//     }
//   };

//   const renderContentSpecifics = () => {
//     switch (notification.type) {
//       case "tags_added":
//         return (
//           <Box mt={1} display="flex" gap={1} flexWrap="wrap">
//             {notification.tags &&
//               notification.tags.map((tag, index) => (
//                 <Chip
//                   key={index}
//                   label={tag}
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     backgroundColor: "#f0f0f0",
//                     color: "#333",
//                     borderColor: "#e0e0e0",
//                     borderRadius: "6px",
//                   }}
//                 />
//               ))}
//           </Box>
//         );
//       case "ACCESS_REQUEST":
//         return (
//           <Box mt={1}>
//             <Box
//               sx={{
//                 padding: "8px 12px",
//                 backgroundColor: "#f5f5f5",
//                 borderRadius: "8px",
//                 border: "1px solid #e0e0e0",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//               }}
//               // onClick={() =>
//               //   onPreviewDocument(
//               //     notification.metadata?.docAttachment // Pass the direct attachment URL
//               //   )
//               // }
//             >
//               <PictureAsPdfIcon color="action" fontSize="small" />
//               <Typography variant="body2" fontWeight="medium">
//                 {notification.metadata?.docName}
//               </Typography>
//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 sx={{ ml: "auto" }}
//               >
//                 Reason:{" "}
//                 {notification.reason || notification.metadata?.reason || "N/A"}
//               </Typography>
//             </Box>
//             {/* Action buttons (Accept/Decline) for pending requests */}
//             {isPendingAccessRequest && (
//               <ActionArea>
//                 <Button
//                   variant="contained"
//                   size="small"
//                   color="inherit"
//                   onClick={() => onDecline(notification.refId, notificationId)}
//                   startIcon={<CancelOutlinedIcon />}
//                 >
//                   Decline
//                 </Button>
//                 <Button
//                   variant="contained"
//                   size="small"
//                   color="primary"
//                   onClick={() => onAccept(notification.refId, notificationId)}
//                   startIcon={<CheckCircleOutlineIcon />}
//                 >
//                   Accept
//                 </Button>
//               </ActionArea>
//             )}
//             {/* Display accepted/rejected status if it's no longer pending */}
//             {accessRequestStatus && accessRequestStatus !== "PENDING" && (
//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//                 sx={{ mt: 1, display: "block" }}
//               >
//                 Status:{" "}
//                 <Box
//                   component="span"
//                   fontWeight="bold"
//                   color={
//                     accessRequestStatus === "ACCEPTED"
//                       ? "success.main"
//                       : "error.main"
//                   }
//                 >
//                   {accessRequestStatus}
//                 </Box>
//               </Typography>
//             )}
//           </Box>
//         );
//       case "ACCESS_REQUEST_STATUS_UPDATE":
//         const statusIcon =
//           notification.metadata?.status === "accepted" ? (
//             <CheckCircleOutlineIcon color="success" fontSize="small" />
//           ) : (
//             <CancelOutlinedIcon color="error" fontSize="small" />
//           );
//         return (
//           <Box
//             mt={1}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               bgcolor: "grey.50",
//               p: 1.5,
//               borderRadius: 1,
//             }}
//           >
//             {statusIcon}
//             <Typography variant="body2" color="text.secondary">
//               Your request for "{notification.metadata?.docType}" was{" "}
//               <Box
//                 component="span"
//                 fontWeight="bold"
//                 color={
//                   notification.metadata?.status === "accepted"
//                     ? "success.main"
//                     : "error.main"
//                 }
//               >
//                 {notification.metadata?.status?.toUpperCase()}
//               </Box>
//               .
//             </Typography>
//           </Box>
//         );
//       case "mentioned":
//         return (
//           <Box mt={1}>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{
//                 backgroundColor: "#f9f9f9",
//                 padding: "12px",
//                 borderRadius: "8px",
//                 border: "1px solid #eee",
//               }}
//             >
//               {notification.message}
//             </Typography>
//             <Box mt={2}>
//               <Button
//                 variant="text"
//                 size="small"
//                 startIcon={<ReplyIcon />}
//                 onClick={() => alert("Reply")}
//               >
//                 Reply
//               </Button>
//             </Box>
//           </Box>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <NotificationItemContainer>
//       <AvatarContainer>
//         <Avatar src={userAvatarUrl} alt={userDisplayName} />
//       </AvatarContainer>
//       <ContentArea>
//         {renderMessage()}
//         <NotificationMeta>
//           {formatTimeDisplay(notification.createdAt)}
//           {notification.projectLink && ` • ${notification.projectLink}`}
//         </NotificationMeta>
//         {renderContentSpecifics()}
//       </ContentArea>
//       {/* Read Status Indicator (Red/Gray Dot) */}
//       <Box
//         sx={{
//           flexShrink: 0,
//           ml: 2,
//           width: "8px",
//           height: "8px",
//           borderRadius: "50%",
//           backgroundColor: isNotificationRead ? "grey.300" : "#FF4136",
//         }}
//       />
//     </NotificationItemContainer>
//   );
// };

// // --- Main Notification Drawer Component ---

// const NotificationDrawer = ({ drawerOpen, setDrawerOpen }) => {
//   const showSnackbar = useSnackbar();

//   const [tabValue, setTabValue] = React.useState(0); // 0 for Inbox, 1 for Team
//   const [notifications, setNotifications] = useState<any[]>([]); // Dynamic notifications state
//   const [loading, setLoading] = useState(true); // Loading state for initial fetch
//   const [error, setError] = useState<string | null>(null); // Error state
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState(""); // Renamed for clarity

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Function to fetch initial notifications from backend
//   const fetchNotifications = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await useGql({
//         query: GET_NOTIFICATIONS,
//         queryName: "systemNotifications",
//         queryType: "query-without-edge",
//         variables: {
//           args: {
//             where: {}, // This 'where' should be updated to filter by user roles/ID
//           },
//         },
//       });

//       if (!result) {
//         showSnackbar("Failed to fetch notifications!", "error");
//         console.error("Failed to fetch notifications: No data received.");
//         setError("Failed to load notifications. No data received.");
//       } else {
//         // Map _id to id for consistency and handle createdAt.$date
//         const mappedNotifications = result.map((notif) => ({
//           ...notif,
//           id: notif.id, // Use _id as the primary ID
//           timestamp: notif.createdAt, // Pass the object { $date: ... } to formatTimeDisplay
//         }));
//         setNotifications(mappedNotifications);
//       }
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//       setError(
//         `Failed to load notifications: ${err.message || "Unknown error"}.`
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [showSnackbar]); // Dependency on showSnackbar

//   // WebSocket listener for new notifications
//   // const handleNewNotification = useCallback((newNotification) => {
//   //   console.log("Received new notification via WebSocket:", newNotification);
//   //   // Map _id to id for consistency and handle createdAt.$date for new notifications
//   //   const processedNotification = {
//   //     ...newNotification,
//   //     id: newNotification._id,
//   //     timestamp: newNotification.createdAt,
//   //   };
//   //   // Add the new notification to the top of the list
//   //   setNotifications((prevNotifications) => [
//   //     processedNotification,
//   //     ...prevNotifications,
//   //   ]);
//   // }, []);

//   // WebSocket listener for new notifications - WITH DEDUPLICATION
//   const handleNewNotification = useCallback((newNotification) => {
//     console.log("Received new notification via WebSocket:", newNotification);

//     // Ensure the new notification has a unique ID for deduplication
//     const newNotificationId = newNotification._id || newNotification.id;
//     if (!newNotificationId) {
//       console.warn(
//         "Received notification without a valid ID, skipping deduplication.",
//         newNotification
//       );
//       return; // Cannot deduplicate without an ID
//     }

//     setNotifications((prevNotifications) => {
//       // Check if a notification with this ID already exists in the current state
//       const isDuplicate = prevNotifications.some(
//         (notif) => (notif._id || notif.id) === newNotificationId
//       );

//       if (isDuplicate) {
//         console.log(
//           "Duplicate notification received via WebSocket, ignoring:",
//           newNotificationId
//         );
//         return prevNotifications; // Return existing state, do not add duplicate
//       } else {
//         // If not a duplicate, process and add it
//         const processedNotification = {
//           ...newNotification,
//           id: newNotification._id || newNotification.id, // Ensure 'id' for consistency if needed
//           timestamp: newNotification.createdAt, // Pass the object { $date: ... } to formatTimeDisplay
//         };
//         // Add the new notification to the top of the list
//         return [processedNotification, ...prevNotifications];
//       }
//     });
//   }, []);

//   // Effect to fetch initial notifications when drawer opens or component mounts
//   useEffect(() => {
//     if (drawerOpen && notifications.length === 0) {
//       fetchNotifications();
//     }
//   }, [drawerOpen, notifications.length, fetchNotifications]);

//   // --- START OF NEW CODE FOR JOINING ROOMS ---
//   useEffect(() => {
//     // This effect runs when the component mounts and whenever socket.connected changes.
//     // We only want to emit 'joinRoom' if the socket is actually connected.
//     if (socket.connected) {
//       // Define static roles for testing purposes as requested
//       const staticRoles = ["ADMIN", "SUPER_ADMIN"];
//       const staticUserId = "static_test_user_id_123"; // Example static user ID

//       // Join user-specific room
//       socket.emit("joinRoom", `user:${staticUserId}`);
//       console.log(`Frontend: Joined user room: user:${staticUserId}`);

//       // Join role-specific rooms
//       staticRoles.forEach((role) => {
//         socket.emit("joinRoom", `role:${role}`);
//         console.log(`Frontend: Joined role room: role:${role}`);
//       });

//       // Optional: Add a listener for reconnect to re-join rooms if connection drops
//       // This is good practice for robust WebSocket applications
//       const onReconnect = () => {
//         console.log("Frontend: Socket reconnected. Rejoining rooms...");
//         socket.emit("joinRoom", `user:${staticUserId}`);
//         staticRoles.forEach((role) => {
//           socket.emit("joinRoom", `role:${role}`);
//         });
//       };
//       socket.on("reconnect", onReconnect);

//       // Cleanup: Remove the reconnect listener when the component unmounts
//       return () => {
//         socket.off("reconnect", onReconnect);
//       };
//     }
//     // Dependency array: This effect re-runs if socket.connected status changes
//   }, [socket.connected]);
//   // --- END OF NEW CODE FOR JOINING ROOMS ---

//   // Effect to set up WebSocket listeners (existing for notification:new)
//   useEffect(() => {
//     socket.on("notification:new", handleNewNotification);

//     // Cleanup WebSocket listener on component unmount
//     return () => {
//       socket.off("notification:new", handleNewNotification);
//     };
//   }, [handleNewNotification]); // Dependency on handleNewNotification to ensure correct callback

//   // Handle Accept Action for Access Request
//   const handleAcceptAccessRequest = useCallback(
//     async (accessRequestId, notificationId) => {
//       try {
//         // TODO: Replace with your actual API endpoint for accepting access requests
//         const response = await fetch(
//           `http://localhost:3000/access-requests/${accessRequestId}/accept`,
//           {
//             method: "PATCH", // Or PUT, depending on your API design
//             headers: {
//               "Content-Type": "application/json",
//               // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Add auth token if needed
//             },
//             // body: JSON.stringify({ notificationId: notificationId }) // Optionally send notification ID
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         console.log("Access request accepted:", result);
//         // Backend should broadcast a new notification with status update, which will update UI via WebSocket
//         // Optimistically update the notification's status in the UI to 'ACCEPTED'
//         setNotifications((prev) =>
//           prev.map((notif) =>
//             notif.type === "ACCESS_REQUEST" && notif.refId === accessRequestId
//               ? {
//                   ...notif,
//                   metadata: {
//                     ...notif.metadata,
//                     accessRequestStatus: "ACCEPTED",
//                   },
//                 }
//               : notif
//           )
//         );
//       } catch (err) {
//         console.error("Failed to accept access request:", err);
//         setError("Failed to accept request. Please try again.");
//       }
//     },
//     []
//   );

//   // Handle Decline Action for Access Request
//   const handleDeclineAccessRequest = useCallback(
//     async (accessRequestId, notificationId) => {
//       try {
//         // TODO: Replace with your actual API endpoint for declining access requests
//         const response = await fetch(
//           `http://localhost:3000/access-requests/${accessRequestId}/reject`,
//           {
//             method: "PATCH", // Or PUT
//             headers: {
//               "Content-Type": "application/json",
//               // 'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Add auth token if needed
//             },
//             // body: JSON.stringify({ notificationId: notificationId }) // Optionally send notification ID
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         console.log("Access request declined:", result);
//         // Backend should broadcast a new notification with status update, which will update UI via WebSocket
//         // Optimistically update the notification's status in the UI to 'REJECTED'
//         setNotifications((prev) =>
//           prev.map((notif) =>
//             notif.type === "ACCESS_REQUEST" && notif.refId === accessRequestId
//               ? {
//                   ...notif,
//                   metadata: {
//                     ...notif.metadata,
//                     accessRequestStatus: "REJECTED",
//                   },
//                 }
//               : notif
//           )
//         );
//       } catch (err) {
//         console.error("Failed to decline access request:", err);
//         setError("Failed to decline request. Please try again.");
//       }
//     },
//     []
//   );

//   // --- UPDATED: Handle Document Preview Click to pass docAttachment directly ---
//   const handlePreviewDocument = useCallback(
//     (docAttachmentUrl) => {
//       if (docAttachmentUrl) {
//         setPreviewAttachmentUrl(docAttachmentUrl); // Set the direct URL
//         setPreviewOpen(true);
//         console.log(
//           `Frontend: Opening document preview for URL: ${docAttachmentUrl}`
//         );
//       } else {
//         console.warn(
//           "Frontend: Cannot preview document, docAttachmentUrl is missing."
//         );
//         showSnackbar("Document attachment URL missing for preview!", "warning");
//       }
//     },
//     [showSnackbar]
//   ); // apiBaseUrl is no longer a dependency here

//   // Example filters - you'd likely have a 'team_related' flag or similar in your real data
//   // For now, let's filter based on recipientRoles for 'ADMIN' for Inbox and others for Team
//   const inboxNotifications = notifications.filter(
//     (n: any) =>
//       n.recipientRoles?.includes("ADMIN") ||
//       n.type === "ACCESS_REQUEST" ||
//       n.type === "mentioned" ||
//       n.type === "tags_added"
//   );
//   const teamNotifications = notifications.filter(
//     (n) => n.type === "ACCESS_REQUEST_STATUS_UPDATE" // Notifications sent to the requesting user
//   );

//   const displayedNotifications =
//     tabValue === 0 ? inboxNotifications : teamNotifications;

//   return (
//     <Drawer
//       className="notification-side-bar"
//       anchor="right"
//       open={drawerOpen}
//       onClose={() => setDrawerOpen(false)}
//       PaperProps={{
//         sx: {
//           width: 400,
//           backgroundColor: "#ffffff",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//           borderRadius: "12px 0 0 12px",
//           overflow: "hidden",
//         },
//       }}
//       sx={{ zIndex: (theme) => theme.zIndex.modal + 10 }}
//     >
//       <Box
//         p={3}
//         pb={0}
//         sx={{ borderBottom: "1px solid #e0e0e0", position: "relative" }}
//       >
//         <Typography variant="h5" fontWeight="bold">
//           Notifications
//         </Typography>
//         <IconButton
//           onClick={() => setDrawerOpen(false)}
//           sx={{ position: "absolute", top: 12, right: 12 }}
//         >
//           <CloseIcon />
//         </IconButton>

//         {/* Tab Navigation */}
//         <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             aria-label="notification tabs"
//           >
//             <Tab
//               label={
//                 <Box display="flex" alignItems="center">
//                   Inbox
//                   <Box
//                     sx={{
//                       ml: 1,
//                       px: 1,
//                       backgroundColor: "#f0f0f0",
//                       borderRadius: "4px",
//                       fontSize: "0.8rem",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {inboxNotifications.length}
//                   </Box>
//                 </Box>
//               }
//               disableRipple
//             />
//             <Tab
//               label={
//                 <Box display="flex" alignItems="center">
//                   Team
//                   <Box
//                     sx={{
//                       ml: 1,
//                       px: 1,
//                       backgroundColor: "#f0f0f0",
//                       borderRadius: "4px",
//                       fontSize: "0.8rem",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {teamNotifications.length}
//                   </Box>
//                 </Box>
//               }
//               disableRipple
//             />
//           </Tabs>
//         </Box>
//       </Box>

//       {/* Notification List */}
//       <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
//         {loading && (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             height="100%"
//           >
//             <CircularProgress />
//             <Typography sx={{ ml: 2 }}>Loading notifications...</Typography>
//           </Box>
//         )}
//         {error && (
//           <Box mt={2}>
//             <Typography color="error">{error}</Typography>
//           </Box>
//         )}
//         {!loading && !error && displayedNotifications.length === 0 && (
//           <Box mt={2} textAlign="center">
//             <Typography variant="body1" color="text.secondary">
//               No notifications to display.
//             </Typography>
//           </Box>
//         )}
//         {!loading && !error && displayedNotifications.length > 0 && (
//           <List disablePadding>
//             {displayedNotifications.map((notification) => (
//               <NotificationItem
//                 key={notification.id} // Use notification.id from backend
//                 notification={notification}
//                 onAccept={handleAcceptAccessRequest} // Pass handlers to item
//                 onDecline={handleDeclineAccessRequest} // Pass handlers to item
//                 onPreviewDocument={handlePreviewDocument}
//               />
//             ))}
//           </List>
//         )}
//       </Box>

//       {/* --- NEW: Document Preview Dialog --- */}
//       <DocumentPreviewDialog
//         open={previewOpen}
//         url={previewAttachmentUrl} // Pass the direct attachment URL
//         apiBaseUrl={apiBaseUrl} // apiBaseUrl might still be useful for the dialog's internal logic if it needs to construct other URLs
//         onClose={() => setPreviewOpen(false)}
//       />
//     </Drawer>
//   );
// };

// export default NotificationDrawer;

// src/components/Notification.tsx (or NotificationDrawer.tsx)

import React, { useEffect, useState, useCallback } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Chip,
  Button,
  IconButton,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import TagIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { styled } from "@mui/system";

// No longer importing socket, useGql, GET_NOTIFICATIONS, useSnackbar here
// import socket from "../lib/socket";
// import { GET_NOTIFICATIONS } from "../lib/graphql/queries/notifications";
// import useGql from "../lib/graphql/gql";
// import { useSnackbar } from "../SnackbarContext";

import DocumentPreviewDialog from "./DocumentPreviewDialog"; // Ensure this path is correct
import useGql from "../lib/graphql/gql";
import { HANDEL_ACCESS_REQUEST_STATUS } from "../lib/graphql/queries/notifications";
import { useSnackbar } from "../SnackbarContext";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// --- Styled Components and Utility Functions ---

const NotificationItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  padding: "16px 0",
  borderBottom: "1px solid #e0e0e0",
  "&:last-child": {
    borderBottom: "none",
  },
}));

const NotificationMeta = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
}));

const AvatarContainer = styled(Box)({
  marginRight: "16px",
});

const ContentArea = styled(Box)({
  flexGrow: 1,
});

const ActionArea = styled(Box)({
  marginTop: "16px",
  display: "flex",
  gap: "8px",
});

const formatTimeDisplay = (timestamp) => {
  if (!timestamp) return "";

  const actualTimestamp =
    typeof timestamp === "object" && timestamp.$date
      ? timestamp.$date
      : timestamp;

  const notificationMoment = moment(actualTimestamp);
  const now = moment();
  const diffHours = now.diff(notificationMoment, "hours");

  if (diffHours < 24) {
    return notificationMoment.fromNow();
  } else if (diffHours < 24 * 7) {
    return notificationMoment.fromNow(true) + " ago";
  } else if (now.year() === notificationMoment.year()) {
    return notificationMoment.format("MMM D");
  } else {
    return notificationMoment.format("MMM D, YYYY");
  }
};

// --- Notification Item Renderer (Flexible) ---
const NotificationItem = ({
  notification,
  onAccept,
  onDecline,
  onPreviewDocument,
}) => {
  const notificationId = notification._id || notification.id;

  const userDisplayName =
    notification.metadata?.requestedByName ||
    notification.user ||
    "Unknown User";
  const userAvatarUrl =
    `${apiBaseUrl}${notification.metadata?.userAvatar}` ||
    "https://i.pravatar.cc/150?img=10";

  const accessRequestStatus =
    notification.type === "ACCESS_REQUEST"
      ? notification.metadata?.accessRequestStatus
      : undefined;
  const isPendingAccessRequest = accessRequestStatus === "PENDING";

  const isNotificationRead =
    notification.isReadBy && notification.isReadBy.length > 0; // Simplified check - this needs to be specific to the current user's ID

  const renderMessage = () => {
    switch (notification.type) {
      case "tags_added":
        return (
          <Typography variant="body1">
            <Box component="span" fontWeight="bold">
              {userDisplayName}
            </Box>{" "}
            added new tags to 🔥{" "}
            <Box component="span" fontWeight="bold">
              {notification.projectName}
            </Box>
          </Typography>
        );
      case "ACCESS_REQUEST":
        return (
          <Typography variant="body1">
            <Box component="span" fontWeight="bold">
              {userDisplayName}
            </Box>{" "}
            requested access to{" "}
            <Box component="span" fontWeight="bold">
              {notification.metadata?.docType || "a document"}
            </Box>
          </Typography>
        );
      case "ACCESS_REQUEST_STATUS_UPDATE":
        const requestStatus = notification.metadata?.status?.toLowerCase();
        return (
          <Typography variant="body1">
            Your access request for{" "}
            <Box component="span" fontWeight="bold">
              {notification.metadata?.docType || "a document"}
            </Box>{" "}
            was{" "}
            <Box
              component="span"
              fontWeight="bold"
              color={
                requestStatus === "accepted" ? "success.main" : "error.main"
              }
            >
              {requestStatus}
            </Box>
          </Typography>
        );
      case "mentioned":
        return (
          <Typography variant="body1">
            <Box component="span" fontWeight="bold">
              {userDisplayName}
            </Box>{" "}
            mentioned you in 💬{" "}
            <Box component="span" fontWeight="bold">
              {notification.projectName}
            </Box>
          </Typography>
        );
      default:
        return (
          <Typography variant="body1">
            New notification from {userDisplayName}
          </Typography>
        );
    }
  };

  const renderContentSpecifics = () => {
    switch (notification.type) {
      case "tags_added":
        return (
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {notification.tags &&
              notification.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    borderColor: "#e0e0e0",
                    borderRadius: "6px",
                  }}
                />
              ))}
          </Box>
        );
      case "ACCESS_REQUEST":
        return (
          <Box mt={1}>
            <Box
              sx={{
                padding: "8px 12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
              onClick={() =>
                onPreviewDocument(notification.metadata?.docAttachment)
              }
            >
              <PersonIcon color="action" fontSize="small" />
              <Typography variant="body2" fontWeight="medium">
                {notification.metadata?.docName || "Document"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: "auto" }}
              >
                Reason:{" "}
                {notification.reason || notification.metadata?.reason || "N/A"}
              </Typography>
            </Box>
            {/* Action buttons (Accept/Decline) for pending requests */}
            {isPendingAccessRequest && (
              <ActionArea>
                <Button
                  variant="contained"
                  size="small"
                  color="inherit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecline(notification.refId, notificationId, "DECLINED");
                  }}
                  startIcon={<CancelOutlinedIcon />}
                >
                  Decline
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccept(notification.refId, notificationId, "ACCEPTED");
                  }}
                  startIcon={<CheckCircleOutlineIcon />}
                >
                  Accept
                </Button>
              </ActionArea>
            )}
            {/* Display accepted/rejected status if it's no longer pending */}
            {accessRequestStatus && accessRequestStatus !== "PENDING" && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Status:{" "}
                <Box
                  component="span"
                  fontWeight="bold"
                  color={
                    accessRequestStatus === "ACCEPTED"
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {accessRequestStatus}
                </Box>
              </Typography>
            )}
          </Box>
        );
      case "ACCESS_REQUEST_STATUS_UPDATE":
        const statusIcon =
          notification.metadata?.status === "accepted" ? (
            <CheckCircleOutlineIcon color="success" fontSize="small" />
          ) : (
            <CancelOutlinedIcon color="error" fontSize="small" />
          );
        return (
          <Box
            mt={1}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "grey.50",
              p: 1.5,
              borderRadius: 1,
            }}
          >
            {statusIcon}
            <Typography variant="body2" color="text.secondary">
              Your request for "{notification.metadata?.docName}" was{" "}
              <Box
                component="span"
                fontWeight="bold"
                color={
                  notification.metadata?.accessRequestStatus === "ACCEPTED"
                    ? "success.main"
                    : "error.main"
                }
              >
                {notification.metadata?.accessRequestStatus?.toUpperCase()}
              </Box>
              .
            </Typography>
          </Box>
        );
      case "mentioned":
        return (
          <Box mt={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            >
              {notification.message}
            </Typography>
            <Box mt={2}>
              <Button
                variant="text"
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => alert("Reply")}
              >
                Reply
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <NotificationItemContainer>
      <AvatarContainer>
        <Avatar src={userAvatarUrl} alt={userDisplayName} />
      </AvatarContainer>
      <ContentArea>
        {renderMessage()}
        <NotificationMeta>
          {formatTimeDisplay(notification.createdAt)}
          {notification.projectLink && ` • ${notification.projectLink}`}
        </NotificationMeta>
        {renderContentSpecifics()}
      </ContentArea>
      {/* Read Status Indicator (Red/Gray Dot) */}
      {/* This logic needs to be based on the current user's read status from isReadBy array */}
      <Box
        sx={{
          flexShrink: 0,
          ml: 2,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isNotificationRead ? "grey.300" : "#FF4136",
        }}
      />
    </NotificationItemContainer>
  );
};

// --- Main Notification Drawer Component ---
// Now receives notifications and markNotificationsAsRead as props
const NotificationDrawer = ({
  drawerOpen,
  setDrawerOpen,
  notifications,
  setNotifications,
  markNotificationsAsRead,
}) => {
  // No longer using useSnackbar directly here, as Layout handles it
  // No longer using loading/error states for fetching, as Layout handles it
  // No longer using fetchNotifications or handleNewNotification here

  const [tabValue, setTabValue] = React.useState(0);

  // --- NEW: State for Document Preview Dialog ---
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState("");

  const showSnackbar = useSnackbar();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // --- Handle Document Preview Click ---
  const handlePreviewDocument = useCallback((docAttachmentUrl) => {
    if (docAttachmentUrl) {
      setPreviewAttachmentUrl(docAttachmentUrl);
      setPreviewOpen(true);
      console.log(
        `Frontend: Opening document preview for URL: ${docAttachmentUrl}`
      );
    } else {
      console.warn(
        "Frontend: Cannot preview document, docAttachmentUrl is missing."
      );
      // showSnackbar("Document attachment URL missing for preview!", "warning"); // showSnackbar is not available here
    }
  }, []);

  // Handle Accept Action for Access Request
  const handleAcceptAccessRequest = useCallback(
    async (accessRequestId, notificationId, status) => {
      try {
        const response = await useGql({
          query: HANDEL_ACCESS_REQUEST_STATUS,
          queryName: "",
          queryType: "mutation",
          variables: {
            notificationId,
            status,
          },
        });

        if (!response) {
          showSnackbar("Failed to update status", "error");
        } else {
          showSnackbar("accepted request", "success");
        }

        // Optimistically update the notification's status in the UI to 'ACCEPTED'
        // This update is now handled by setNotifications passed from Layout
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.type === "ACCESS_REQUEST" && notif.refId === accessRequestId
              ? {
                  ...notif,
                  metadata: {
                    ...notif.metadata,
                    accessRequestStatus: "ACCEPTED",
                  },
                }
              : notif
          )
        );
      } catch (err: any) {
        console.error("Failed to accept access request:", err);
        // showSnackbar(`Failed to accept request: ${err.message || "Unknown error"}.`, "error"); // showSnackbar not available
      }
    },
    [setNotifications] // Add setNotifications to dependency array
  );

  // Example filters - based on the notifications array passed as prop
  const inboxNotifications = notifications.filter(
    (n: any) =>
      n.recipientRoles?.includes("ADMIN") ||
      n.type === "ACCESS_REQUEST" ||
      n.type === "mentioned" ||
      n.type === "tags_added"
  );
  const teamNotifications = notifications.filter(
    (n) => n.type === "ACCESS_REQUEST_STATUS_UPDATE"
  );

  const displayedNotifications =
    tabValue === 0 ? inboxNotifications : teamNotifications;

  return (
    <Drawer
      className="notification-side-bar"
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: 400,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          borderRadius: "12px 0 0 12px",
          overflow: "hidden",
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 10 }}
    >
      <Box
        p={3}
        pb={0}
        sx={{ borderBottom: "1px solid #e0e0e0", position: "relative" }}
      >
        <Typography variant="h5" fontWeight="bold">
          Notifications
        </Typography>
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="notification tabs"
          >
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  Inbox
                  <Box
                    sx={{
                      ml: 1,
                      px: 1,
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {inboxNotifications.length}
                  </Box>
                </Box>
              }
              disableRipple
            />
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  Team
                  <Box
                    sx={{
                      ml: 1,
                      px: 1,
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {teamNotifications.length}
                  </Box>
                </Box>
              }
              disableRipple
            />
          </Tabs>
        </Box>
      </Box>

      {/* Notification List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        {/* Loading and error states are now managed by Layout, but we can show local loading if needed */}
        {/* For now, assuming notifications prop will be empty if loading/error in Layout */}
        {notifications.length === 0 && (
          <Box mt={2} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              No notifications to display.
            </Typography>
          </Box>
        )}
        {notifications.length > 0 && (
          <List disablePadding>
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onAccept={handleAcceptAccessRequest}
                onDecline={handleAcceptAccessRequest}
                onPreviewDocument={handlePreviewDocument}
              />
            ))}
          </List>
        )}
      </Box>

      <DocumentPreviewDialog
        open={previewOpen}
        url={previewAttachmentUrl}
        onClose={() => setPreviewOpen(false)}
      />
    </Drawer>
  );
};

export default NotificationDrawer;
