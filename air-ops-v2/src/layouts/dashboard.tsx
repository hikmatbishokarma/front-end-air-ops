// import * as React from "react";
// import LinearProgress from "@mui/material/LinearProgress";
// import { Outlet, Navigate, useLocation, useNavigate } from "react-router";
// import { DashboardLayout } from "@toolpad/core/DashboardLayout";
// import { PageContainer } from "@toolpad/core/PageContainer";
// import { Account, SignOutButton } from "@toolpad/core/Account";
// import { useSession } from "@/app/providers";
// import {
//   Avatar,
//   Badge,
//   Box,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   Menu,
//   MenuItem,
//   Typography,
// } from "@mui/material";
// import { ClockCompact } from "../components/Clock";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import moment from "moment";
// import NotificationDrawer from "../components/Notification";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// export default function Layout() {
//   const { session, loading } = useSession();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [unreadCount, setUnreadCount] = React.useState(0);
//   const [drawerOpen, setDrawerOpen] = React.useState(false);

//   if (loading) {
//     return (
//       <div style={{ width: "100%" }}>
//         <LinearProgress />
//       </div>
//     );
//   }

//   if (!session) {
//     const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;
//     // const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;
//     return <Navigate to={redirectTo} replace />;
//   }

//   function CustomAccount() {
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const openMenu = Boolean(anchorEl);

//     const handleAccountClick = (event) => {
//       setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//       setAnchorEl(null);
//     };

//     return (
//       <Box display="flex" alignItems="center" gap={2}>
//         <ClockCompact />
//         <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
//           <Badge badgeContent={unreadCount} color="error">
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>

//         {/* --- REPLACED: Toolpad's <Account /> with a standard MUI IconButton or Avatar --- */}
//         <IconButton
//           aria-label="account menu"
//           aria-controls={openMenu ? "account-menu" : undefined}
//           aria-haspopup="true"
//           onClick={handleAccountClick} // Our handler to open the custom Menu
//           color="inherit" // Inherit color from parent (e.g., AppBar)
//           sx={{ p: 0 }} // Remove default padding for tighter look
//         >
//           {session?.user?.image ? ( // Use user's avatar if available
//             <Avatar
//               alt={session.user.name || "User"}
//               src={session.user.image}
//             />
//           ) : (
//             // Otherwise, use a generic AccountCircle icon
//             <AccountCircleIcon fontSize="large" />
//           )}
//         </IconButton>
//         {/* --- END REPLACED SECTION --- */}

//         {/* This is YOUR custom Material-UI Menu, fully controlled by your state */}
//         <Menu
//           id="account-menu" // Link to aria-controls
//           anchorEl={anchorEl}
//           open={openMenu}
//           onClose={handleMenuClose}
//           anchorOrigin={{
//             vertical: "bottom",
//             horizontal: "right",
//           }}
//           transformOrigin={{
//             vertical: "top",
//             horizontal: "right",
//           }}
//         >
//           {/* Optional: Show current user info at the top of the menu */}
//           {session?.user && (
//             <Box
//               sx={{
//                 p: 1.5,
//                 pb: 0,
//                 borderBottom: "1px solid",
//                 borderColor: "divider",
//               }}
//             >
//               <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
//                 {session.user.name || "User"}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 {session.user.email || ""}
//               </Typography>
//             </Box>
//           )}
//           {/* Your custom menu items */}
//           <MenuItem
//             onClick={() => {
//               handleMenuClose(); // Close our menu
//               navigate("/settings/profile"); // Navigate to My Profile page
//             }}
//           >
//             My Profile
//           </MenuItem>
//           <MenuItem
//             onClick={() => {
//               handleMenuClose(); // Close our menu
//               navigate("/settings/leave"); // Navigate to My Leaves page
//             }}
//           >
//             My Leaves
//           </MenuItem>
//           <Divider />
//           <MenuItem sx={{ p: 0 }} className="top-header-file">
//             <SignOutButton
//               // sx={{
//               //   width: "100%",
//               //   justifyContent: "flex-start",
//               //   textTransform: "none",
//               //   color: (theme) => theme.palette.text.primary,
//               //   padding: (theme) => theme.spacing(1, 2),
//               //   backgroundColor: "transparent",
//               //   "&:hover": {
//               //     backgroundColor: (theme) => theme.palette.action.hover,
//               //   },
//               //   "& .MuiButton-startIcon svg": {
//               //     fill: (theme) => theme.palette.text.primary,
//               //   },
//               //   minWidth: "auto",
//               //   minHeight: "auto",
//               //   overflow: "visible",
//               //   display: "flex",
//               //   alignItems: "center",
//               //   gap: 1,
//               // }}
//               sx={{
//                 width: "100%",
//                 justifyContent: "flex-start",
//                 textTransform: "none",
//                 // AGGRESSIVE COLOR OVERRIDE FOR DEBUGGING:
//                 color: "blue !important", // Try a very distinct color (e.g., 'blue', 'lime', 'magenta')
//                 // Using !important to try to force it.
//                 padding: (theme) => theme.spacing(1, 2),
//                 backgroundColor: "transparent",
//                 "&:hover": {
//                   backgroundColor: (theme) => theme.palette.action.hover,
//                 },
//                 // Also target the icon explicitly in case its color is separate
//                 "& .MuiButton-startIcon svg": {
//                   // Target the SVG inside the icon span
//                   fill: "#fff !important", // Force icon color as well
//                 },
//                 // Ensure nothing is hiding it by size
//                 minWidth: "auto",
//                 minHeight: "auto",
//                 overflow: "visible",
//                 display: "flex", // Ensure flex layout for alignment
//                 alignItems: "center", // Vertically align content
//                 gap: 1, // Small gap between icon and text
//               }}
//             />
//           </MenuItem>
//         </Menu>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "#ddd", // Light gray background
//         padding: 2, // Optional
//       }}
//     >
//       <DashboardLayout
//         slots={{ toolbarAccount: CustomAccount }}
//         sx={{
//           "& .MuiBreadcrumbs-root": { display: "none" },
//           "& h4.MuiTypography-root": { display: "none" },
//         }}
//       >
//         <PageContainer>
//           <Outlet />
//         </PageContainer>
//       </DashboardLayout>

//       <NotificationDrawer
//         drawerOpen={drawerOpen}
//         setDrawerOpen={setDrawerOpen}
//       />
//     </Box>
//   );
// }

// src/Layout.tsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Account, SignOutButton } from "@toolpad/core/Account";
import { useSession } from "@/app/providers";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer, // Not used directly here, but NotificationDrawer uses it
  IconButton,
  List, // Not used directly here
  ListItem, // Not used directly here
  ListItemText, // Not used directly here
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { ClockCompact } from "../components/Clock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Not used directly here
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"; // Not used directly here
import moment from "moment"; // Not used directly here
import NotificationDrawer from "../components/Notification"; // Renamed from Notification.tsx
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import socket from "../lib/socket"; // Import your Socket.IO client instance
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATIO_AS_READ,
} from "../lib/graphql/queries/notifications"; // Your GraphQL query
import useGql from "../lib/graphql/gql"; // Your GraphQL hook
import { useSnackbar } from "@/app/providers"; // Your Snackbar context

// const NOTIFICATION_SOUND_URL =
//   "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAAA";

export default function Layout() {
  const { session, loading } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar(); // Access the snackbar context

  // --- Notification State Management (LIFTED FROM NotificationDrawer) ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true); // Renamed to avoid conflict
  const [notificationError, setNotificationError] = useState<string | null>(
    null
  ); // Renamed to avoid conflict

  // State for the notification drawer's open/close status
  const [drawerOpen, setDrawerOpen] = useState(false);

  // State for document preview dialog (if needed in Layout, otherwise keep in Drawer)
  // Keeping it in NotificationDrawer is generally better for encapsulation.

  // --- Calculate unread count ---
  // A memoized calculation to avoid unnecessary re-calculations
  const unreadCount = useMemo(() => {
    // Assuming 'isReadBy' is an array of user IDs who have read the notification.
    // A notification is unread if the current user's ID is NOT in its isReadBy array.
    // You'll need to replace 'session?.user?.id' with the actual ID of the logged-in user.
    const currentUserId = session?.user?.id; // Get current user's ID from session
    if (!currentUserId) return 0; // If no user, no unread notifications for them

    return notifications.filter(
      (notif) => !notif.isReadBy?.includes(currentUserId)
    ).length;
  }, [notifications, session?.user?.id]);

  // --- Function to fetch initial notifications from backend ---
  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) {
      console.warn("Cannot fetch notifications: User session ID is missing.");
      setLoadingNotifications(false);
      return;
    }

    setLoadingNotifications(true);
    setNotificationError(null);
    try {
      const currentUserId = session.user.id;
      const currentUserRoles = session.user.roles || []; // Assuming roles are on session.user

      const result = await useGql({
        query: GET_NOTIFICATIONS,
        queryName: "systemNotifications",
        queryType: "query-without-edge",
        variables: {
          args: {
            where: {
              // Filter notifications relevant to the current user and their roles
              $or: [
                { recipientIds: currentUserId }, // Notifications sent directly to this user
                { recipientRoles: { $in: currentUserRoles } }, // Notifications sent to roles this user has
              ],
            },
          },
        },
      });

      const fetchedNotifications =
        result?.data?.systemNotifications || result || [];


      console.log("fetchedNotifications::", fetchedNotifications);

      if (!fetchedNotifications || fetchedNotifications.length === 0) {
        // showSnackbar("No new notifications!", "info"); // Only show if genuinely no notifications
        console.log("No notifications fetched or empty array.");
      } else {
        // Sort the notifications array on the client side
        const sortedNotifications = fetchedNotifications.sort((a, b) => {
          // Convert dates to a comparable format (e.g., a number)
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          // Sort in descending order (latest date first)
          return dateB.getTime() - dateA.getTime();
        });

        const mappedNotifications = sortedNotifications.map((notif: any) => ({
          ...notif,
          id: notif._id || notif.id,
          timestamp: notif.createdAt,
        }));
        setNotifications(mappedNotifications);
      }
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err);
      setNotificationError(
        `Failed to load notifications: ${err.message || "Unknown error"}.`
      );
      showSnackbar(
        `Failed to load notifications: ${err.message || "Unknown error"}.`,
        "error"
      );
    } finally {
      setLoadingNotifications(false);
    }
  }, [session?.user?.id, session?.user?.roles]); // Dependencies for useCallback

  // --- WebSocket listener for new notifications - WITH DEDUPLICATION & SNACKBAR ---
  const handleNewNotification = useCallback(
    (newNotification: any) => {
      console.log("Received new notification via WebSocket:", newNotification);

      const newNotificationId = newNotification._id || newNotification.id;
      if (!newNotificationId) {
        console.warn(
          "Received notification without a valid ID, skipping deduplication.",
          newNotification
        );
        return;
      }

      setNotifications((prevNotifications) => {
        const isDuplicate = prevNotifications.some(
          (notif) => (notif._id || notif.id) === newNotificationId
        );

        if (isDuplicate) {
          console.log(
            "Duplicate notification received via WebSocket, ignoring:",
            newNotificationId
          );
          return prevNotifications;
        } else {
          const processedNotification = {
            ...newNotification,
            id: newNotification._id || newNotification.id,
            timestamp: newNotification.createdAt,
          };

          // // Play notification sound
          // try {
          //   const audio = new Audio(NOTIFICATION_SOUND_URL);
          //   audio
          //     .play()
          //     .catch((e) =>
          //       console.error("Error playing notification sound:", e)
          //     );
          // } catch (e) {
          //   console.error("Failed to create or play audio object:", e);
          // }
          // Show a snackbar for the new notification
          showSnackbar(
            processedNotification.message || "You have a new notification!",
            "info"
          );
          return [processedNotification, ...prevNotifications]; // Add to top
        }
      });
    },
    [showSnackbar]
  );

  // --- Function to mark notifications as read ---
  const markNotificationsAsRead = useCallback(
    async (notificationIdsToMark: string[]) => {
      if (
        !notificationIdsToMark ||
        notificationIdsToMark.length === 0 ||
        !session?.user?.id
      ) {
        return; // Nothing to mark or no user
      }

      try {
        // TODO: Replace with your actual API endpoint for marking notifications as read
        // This endpoint should accept an array of notification IDs and the current user's ID

        const response = await useGql({
          query: MARK_NOTIFICATIO_AS_READ,
          queryName: "",
          queryType: "mutation",
          variables: {
            input: {
              notificationIds: notificationIdsToMark,
              userId: session?.user?.id,
            },
          },
        });

        // Optimistically update the frontend state immediately
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => {
            if (notificationIdsToMark.includes(notif.id || notif._id)) {
              // Ensure isReadBy array exists and add current user's ID if not already there
              const updatedIsReadBy = new Set(notif.isReadBy || []);
              updatedIsReadBy.add(session.user.id);
              return { ...notif, isReadBy: Array.from(updatedIsReadBy) };
            }
            return notif;
          })
        );
        // showSnackbar("Notifications marked as read!", "success"); // Optional: confirmation
      } catch (err: any) {
        console.error("Failed to mark notifications as read:", err);
        showSnackbar(
          `Failed to mark notifications as read: ${err.message || "Unknown error"}.`,
          "error"
        );
      }
    },
    [session?.user?.id, showSnackbar]
  ); // Dependency on current user ID and snackbar

  // --- Effect to fetch initial notifications on component mount ---
  // --- Effect to fetch initial notifications on component mount ---
  useEffect(() => {
    // Fetch notifications when the Layout component mounts and session is available,
    // and if notifications haven't been loaded yet for this session.
    // The `loadingNotifications` state is managed internally by `fetchNotifications`.
    if (session && notifications.length === 0) {
      // Removed `!loadingNotifications` from condition
      fetchNotifications();
    }
  }, [session, notifications.length, fetchNotifications]);

  // --- Effect to set up WebSocket listeners ---
  useEffect(() => {
    if (session?.user?.id) {
      // Only set up listeners if user is logged in
      // Join rooms based on user ID and roles
      const currentUserId = session.user.id;
      const currentUserRoles = session.user.roles || [];

      socket.emit("joinRoom", `user:${currentUserId}`);

      currentUserRoles.forEach((role: string) => {
        socket.emit("joinRoom", `role:${role}`);
      });

      // Listener for new notifications
      socket.on("notification:new", handleNewNotification);

      // Listener for reconnect to re-join rooms
      const onReconnect = () => {
        console.log("Frontend: Socket reconnected. Rejoining rooms...");
        socket.emit("joinRoom", `user:${currentUserId}`);
        currentUserRoles.forEach((role: string) => {
          socket.emit("joinRoom", `role:${role}`);
        });
        // After reconnecting and rejoining rooms, you might want to re-fetch notifications
        // to ensure consistency, especially if some were missed during disconnect.
        fetchNotifications();
      };
      socket.on("reconnect", onReconnect);

      // Cleanup: Remove all listeners when component unmounts or user logs out
      return () => {
        socket.off("notification:new", handleNewNotification);
        socket.off("reconnect", onReconnect);
      };
    }
  }, [session, handleNewNotification, fetchNotifications]); // Dependencies: session (for user data), and callbacks

  // Note: Authentication and permission checks are now handled by ProtectedRoute
  // This component assumes user is already authenticated and authorized
  if (loading) {
    return (
      <div style={{ width: "100%" }}>
        <LinearProgress />
      </div>
    );
  }

  // Additional safety check - should not reach here if not authenticated
  // (ProtectedRoute handles redirect)
  if (!session) {
    const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  function CustomAccount() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const handleAccountClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    // --- NEW: Handle opening drawer and marking notifications as read ---
    const handleOpenNotificationDrawer = () => {
      setDrawerOpen(true);
      // Get IDs of currently displayed unread notifications to mark them as read
      const unreadNotificationIds = notifications
        .filter((notif) => !notif.isReadBy?.includes(session?.user?.id))
        .map((notif) => notif.id || notif._id);

      if (unreadNotificationIds.length > 0) {
        markNotificationsAsRead(unreadNotificationIds);
      }
    };

    return (
      <Box display="flex" alignItems="center" gap={2}>
        <ClockCompact />
        <IconButton color="inherit" onClick={handleOpenNotificationDrawer}>
          {" "}
          {/* Use new handler */}
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton
          aria-label="account menu"
          aria-controls={openMenu ? "account-menu" : undefined}
          aria-haspopup="true"
          onClick={handleAccountClick}
          color="inherit"
          sx={{ p: 0 }}
        >
          {session?.user?.image ? (
            <Avatar
              alt={session.user.name || "User"}
              src={session.user.image}
            />
          ) : (
            <AccountCircleIcon fontSize="large" />
          )}
        </IconButton>

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {session?.user && (
            <Box
              sx={{
                p: 1.5,
                pb: 0,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                {session.user.name || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {session.user.email || ""}
              </Typography>
            </Box>
          )}
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/app/settings/profile");
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/app/settings/leave");
            }}
          >
            My Leaves
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/app/my-tickets");
            }}
          >
            My Tickets
          </MenuItem>

          <Divider />
          <MenuItem sx={{ p: 0 }} className="top-header-file">
            <SignOutButton
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                textTransform: "none",
                color: "blue !important",
                padding: (theme) => theme.spacing(1, 2),
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
                "& .MuiButton-startIcon svg": {
                  fill: "#fff !important",
                },
                minWidth: "auto",
                minHeight: "auto",
                overflow: "visible",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            />
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ddd",
        padding: 2,
      }}
    >
      <DashboardLayout
        slots={{ toolbarAccount: CustomAccount }}
        sx={{
          "& .MuiBreadcrumbs-root": { display: "none" },
          "& h4.MuiTypography-root": { display: "none" },
        }}
      >
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>

      {/* Pass notification state and handlers to the NotificationDrawer */}
      <NotificationDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        notifications={notifications} // Pass the notifications array
        setNotifications={setNotifications} // Pass the setter (or a more specific update function)
        markNotificationsAsRead={markNotificationsAsRead} // Pass the mark as read function
      />
    </Box>
  );
}
