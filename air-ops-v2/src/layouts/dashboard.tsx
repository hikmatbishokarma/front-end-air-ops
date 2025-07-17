import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Account, SignOutButton } from "@toolpad/core/Account";
import { useSession } from "../SessionContext";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { ClockCompact } from "../components/Clock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import moment from "moment";
import NotificationDrawer from "../components/Notification";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// function CustomAccount() {
//   return (
//     <Account
//       slotProps={{
//         preview: { slotProps: { avatarIconButton: { sx: { border: "0" } } } },
//       }}
//     />
//   );
// }

export default function Layout() {
  const { session, loading } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  if (loading) {
    return (
      <div style={{ width: "100%" }}>
        <LinearProgress />
      </div>
    );
  }

  if (!session) {
    const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;
    // const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={redirectTo} replace />;
  }

  // function CustomAccount() {

  //   return (
  //     <Box display="flex" alignItems="center" gap={2}>
  //       <ClockCompact /> {/* Clock on the left */}
  //       <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
  //         <Badge badgeContent={unreadCount} color="error">
  //           <NotificationsIcon />
  //         </Badge>
  //       </IconButton>
  //       {/* <Account
  //         slotProps={{
  //           preview: {
  //             slotProps: { avatarIconButton: { sx: { border: "0" } } },
  //           },
  //         }}
  //       /> */}
  //       <Account
  //         slots={{
  //           // Override the default Popover with your custom menu logic
  //           popover: (props) => {
  //             console.log("Props received by custom popover:", props);

  //             return (
  //               <Menu
  //                 {...props} // Pass through default popover props (like anchorEl, open, onClose)
  //                 anchorOrigin={{
  //                   vertical: "bottom",
  //                   horizontal: "right",
  //                 }}
  //                 transformOrigin={{
  //                   vertical: "top",
  //                   horizontal: "right",
  //                 }}
  //               >
  //                 {/* Optional: Show current user info at the top of the menu */}
  //                 {session?.user && (
  //                   <Box
  //                     sx={{
  //                       p: 1.5,
  //                       pb: 0,
  //                       borderBottom: "1px solid",
  //                       borderColor: "divider",
  //                     }}
  //                   >
  //                     <Typography
  //                       variant="subtitle2"
  //                       sx={{ fontWeight: "bold" }}
  //                     >
  //                       {session.user.name || "User"}
  //                     </Typography>
  //                     <Typography
  //                       variant="body2"
  //                       color="text.secondary"
  //                       sx={{ mb: 1 }}
  //                     >
  //                       {session.user.email || ""}
  //                     </Typography>
  //                   </Box>
  //                 )}
  //                 {/* Your custom menu items */}
  //                 <MenuItem
  //                   onClick={() => {
  //                     props.onClose?.({}, "backdropClick");
  //                     navigate("/settings/profile"); // Navigate to My Profile page
  //                   }}
  //                 >
  //                   My Profile
  //                 </MenuItem>
  //                 <MenuItem
  //                   onClick={() => {
  //                     navigate("/settings/leave"); // Navigate to My Leaves page
  //                   }}
  //                 >
  //                   My Leaves
  //                 </MenuItem>
  //                 <Divider /> {/* Visual separator */}
  //                 {/* IMPORTANT: Render Toolpad's SignOutButton directly here */}
  //                 {/* This ensures its default functionality is preserved */}
  //                 <MenuItem>
  //                   <SignOutButton
  //                     // sx={{
  //                     //   // Apply styling to make it look like a regular MenuItem
  //                     //   width: "100%", // Take full width of MenuItem
  //                     //   justifyContent: "flex-start", // Align text to left
  //                     //   padding: "6px 16px", // Match MenuItem padding
  //                     //   textTransform: "none", // Remove uppercase if default button is uppercase
  //                     //   // color: "text.primary", // Use default text color
  //                     //   color: "#000000",
  //                     //   "&:hover": {
  //                     //     backgroundColor: (theme) => theme.palette.action.hover, // Apply hover effect
  //                     //   },
  //                     // }}
  //                     sx={{
  //                       width: "100%",
  //                       justifyContent: "flex-start",
  //                       textTransform: "none",
  //                       // AGGRESSIVE COLOR OVERRIDE FOR DEBUGGING:
  //                       color: "blue !important", // Try a very distinct color (e.g., 'blue', 'lime', 'magenta')
  //                       // Using !important to try to force it.
  //                       padding: (theme) => theme.spacing(1, 2),
  //                       backgroundColor: "transparent",
  //                       "&:hover": {
  //                         backgroundColor: (theme) =>
  //                           theme.palette.action.hover,
  //                       },
  //                       // Also target the icon explicitly in case its color is separate
  //                       "& .MuiButton-startIcon svg": {
  //                         // Target the SVG inside the icon span
  //                         fill: "blue !important", // Force icon color as well
  //                       },
  //                       // Ensure nothing is hiding it by size
  //                       minWidth: "auto",
  //                       minHeight: "auto",
  //                       overflow: "visible",
  //                       display: "flex", // Ensure flex layout for alignment
  //                       alignItems: "center", // Vertically align content
  //                       gap: 1, // Small gap between icon and text
  //                     }}
  //                   />
  //                 </MenuItem>
  //               </Menu>
  //             );
  //           },
  //         }}
  //         // Keep your existing slotProps for preview if they are still relevant
  //         slotProps={{
  //           preview: {
  //             slotProps: { avatarIconButton: { sx: { border: "0" } } },
  //           },
  //           // No need to pass signOutButton props here if you're rendering it directly in the Popover
  //         }}
  //       />
  //     </Box>
  //   );
  // }

  function CustomAccount() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const handleAccountClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <Box display="flex" alignItems="center" gap={2}>
        <ClockCompact />
        <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* --- REPLACED: Toolpad's <Account /> with a standard MUI IconButton or Avatar --- */}
        <IconButton
          aria-label="account menu"
          aria-controls={openMenu ? "account-menu" : undefined}
          aria-haspopup="true"
          onClick={handleAccountClick} // Our handler to open the custom Menu
          color="inherit" // Inherit color from parent (e.g., AppBar)
          sx={{ p: 0 }} // Remove default padding for tighter look
        >
          {session?.user?.image ? ( // Use user's avatar if available
            <Avatar
              alt={session.user.name || "User"}
              src={session.user.image}
            />
          ) : (
            // Otherwise, use a generic AccountCircle icon
            <AccountCircleIcon fontSize="large" />
          )}
        </IconButton>
        {/* --- END REPLACED SECTION --- */}

        {/* This is YOUR custom Material-UI Menu, fully controlled by your state */}
        <Menu
          id="account-menu" // Link to aria-controls
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
          {/* Optional: Show current user info at the top of the menu */}
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
          {/* Your custom menu items */}
          <MenuItem
            onClick={() => {
              handleMenuClose(); // Close our menu
              navigate("/settings/profile"); // Navigate to My Profile page
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose(); // Close our menu
              navigate("/settings/leave"); // Navigate to My Leaves page
            }}
          >
            My Leaves
          </MenuItem>
          <Divider />
          <MenuItem sx={{ p: 0 }}>
            <SignOutButton
              // sx={{
              //   width: "100%",
              //   justifyContent: "flex-start",
              //   textTransform: "none",
              //   color: (theme) => theme.palette.text.primary,
              //   padding: (theme) => theme.spacing(1, 2),
              //   backgroundColor: "transparent",
              //   "&:hover": {
              //     backgroundColor: (theme) => theme.palette.action.hover,
              //   },
              //   "& .MuiButton-startIcon svg": {
              //     fill: (theme) => theme.palette.text.primary,
              //   },
              //   minWidth: "auto",
              //   minHeight: "auto",
              //   overflow: "visible",
              //   display: "flex",
              //   alignItems: "center",
              //   gap: 1,
              // }}
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                textTransform: "none",
                // AGGRESSIVE COLOR OVERRIDE FOR DEBUGGING:
                color: "blue !important", // Try a very distinct color (e.g., 'blue', 'lime', 'magenta')
                // Using !important to try to force it.
                padding: (theme) => theme.spacing(1, 2),
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
                // Also target the icon explicitly in case its color is separate
                "& .MuiButton-startIcon svg": {
                  // Target the SVG inside the icon span
                  fill: "blue !important", // Force icon color as well
                },
                // Ensure nothing is hiding it by size
                minWidth: "auto",
                minHeight: "auto",
                overflow: "visible",
                display: "flex", // Ensure flex layout for alignment
                alignItems: "center", // Vertically align content
                gap: 1, // Small gap between icon and text
              }}
            />
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  const handleApprove = (id) => {
    console.log("ss");
  };

  const handleDecline = (id) => {
    console.log("ss");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ddd", // Light gray background
        padding: 2, // Optional
      }}
    >
      {/* <DashboardLayout slots={{ toolbarAccount: CustomAccount }}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout> */}
      {/* <DashboardLayout slots={{ toolbarAccount: CustomAccount }}>
        <Outlet />
      </DashboardLayout> */}
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

      {/* <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        keepMounted
        PaperProps={{
          sx: {
            width: 400,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            zIndex: (theme) => theme.zIndex.modal + 10,
            backgroundColor: "#fff", // Light background for readability
            color: "#000", // Ensure text is visible
          },
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 10,
        }}
      >
        <Box width={300} p={2}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <List>
            {notifications.map((n) => (
              <ListItem key={n.id} divider alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box>
                     
                      <Typography variant="body2" color="text.secondary">
                        {n.requestedBy} – {moment().format("Do MMM YYYY")}
                      </Typography>

                    
                      <Typography variant="body2" color="text.secondary">
                        {n.message}
                      </Typography>
                    </Box>
                  }
                />

               
                {n.status === "pending" && (
                  <Box display="flex" gap={1} mt={1}>
                    <IconButton
                      color="success"
                      size="small"
                      onClick={() => handleApprove(n.id)}
                    >
                      <CheckCircleOutlineIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDecline(n.id)}
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer> */}

      <NotificationDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </Box>
  );
}
