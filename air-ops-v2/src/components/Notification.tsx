import React from "react";
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
} from "@mui/material";
import moment from "moment"; // Ensure moment is imported
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import TagIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { styled } from "@mui/system";

// --- Styled Components and Utility Functions (from previous answer, kept for context) ---

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

// --- NEW: Function to format time dynamically ---
const formatTimeDisplay = (timestamp) => {
  if (!timestamp) return "";

  const notificationMoment = moment(timestamp);
  const now = moment();
  const diffHours = now.diff(notificationMoment, "hours");

  if (diffHours < 24) {
    // If less than 24 hours old, show "X minutes ago", "an hour ago", etc.
    return notificationMoment.fromNow();
  } else if (diffHours < 24 * 7) {
    // Within a week
    // If less than 7 days old, show "X days ago"
    return notificationMoment.fromNow(true) + " ago"; // 'true' for no 'in/ago'
  } else if (now.year() === notificationMoment.year()) {
    // If within the current year, show "Month Day" (e.g., "Feb 8")
    return notificationMoment.format("MMM D");
  } else {
    // If an older year, show "Month Day, Year" (e.g., "Feb 8, 2024")
    return notificationMoment.format("MMM D, YYYY");
  }
};

// --- UPDATED: Mock Data Structure with timestamps ---
const notifications = [
  {
    id: 1,
    type: "tags_added",
    user: "Hailey Garza",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    timestamp: moment().subtract(1, "minute").toISOString(), // 1 minute ago
    projectName: "Ease Design System",
    projectLink: "Easy 2023 Project",
    tags: ["UI Design", "Dashboard", "Design system"],
    status: "read",
  },
  {
    id: 2,
    type: "join_request",
    user: "Kamron",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    timestamp: moment().subtract(1, "hour").toISOString(), // 1 hour ago
    projectName: "Ease Design System",
    projectLink: "Easy 2023 Project",
    file: "Ease Design System.fig",
    fileEditedTime: "Edited 12 mins. ago", // This is specific to the file, not the notification creation time
    status: "pending",
  },
  {
    id: 3,
    type: "mentioned",
    user: "Winfield",
    userAvatar: "https://i.pravatar.cc/150?img=6",
    timestamp: moment("2025-02-08T10:00:00Z").toISOString(), // Specific past date (Feb 8, 2025)
    projectName: "Kohaku Landing Page",
    projectLink: "Landing Page 2025", // Updated year for consistency
    message:
      "@tranmautritam Hey, I just brought in some missing states from our old design file. Can you help set up the components?",
    status: "read",
  },
  {
    id: 4,
    type: "tags_added",
    user: "John Doe",
    userAvatar: "https://i.pravatar.cc/150?img=7",
    timestamp: moment().subtract(5, "days").toISOString(), // 5 days ago
    projectName: "New Marketing Campaign",
    projectLink: "Project Q3 2025",
    tags: ["Marketing", "Campaign", "Strategy"],
    status: "unread",
  },
  {
    id: 5,
    type: "mentioned",
    user: "Jane Smith",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    timestamp: moment("2024-11-15T10:00:00Z").toISOString(), // Old date from previous year
    projectName: "Archived Project",
    projectLink: "Old Stuff",
    message: "Remember that old feature we discussed last year?",
    status: "read",
  },
];

// --- Notification Item Renderer (Flexible) ---

const NotificationItem = ({ notification }) => {
  const { user, userAvatar, timestamp, projectName, projectLink, status } =
    notification; // Destructure timestamp

  // Function to render the main notification message
  const renderMessage = () => {
    switch (notification.type) {
      case "tags_added":
        return (
          <Typography variant="body1">
            <Box component="span" fontWeight="bold">
              {user}
            </Box>{" "}
            added new tags to 🔥{" "}
            <Box component="span" fontWeight="bold">
              {projectName}
            </Box>
          </Typography>
        );
      case "join_request":
        return (
          <Typography variant="body1">
            <Box component="span" fontWeight="bold">
              {user}
            </Box>{" "}
            asked to join{" "}
            <Box component="span" fontWeight="bold">
              {projectName}
            </Box>
          </Typography>
        );
      case "mentioned":
        return (
          <Typography variant="body1">
            <Box component="span" fontWeight="bold">
              {user}
            </Box>{" "}
            mentioned you in 💬{" "}
            <Box component="span" fontWeight="bold">
              {projectName}
            </Box>
          </Typography>
        );
      default:
        return (
          <Typography variant="body1">New notification from {user}</Typography>
        );
    }
  };

  // Function to render specific content/actions based on type
  const renderContentSpecifics = () => {
    switch (notification.type) {
      case "tags_added":
        return (
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {notification.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                // icon={<TagIcon fontSize="small" />}
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
      case "join_request":
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
              }}
            >
              <PersonIcon color="action" fontSize="small" />
              <Typography variant="body2" fontWeight="medium">
                {notification.file}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: "auto" }}
              >
                {notification.fileEditedTime}
              </Typography>
            </Box>
            {/* Action buttons (Accept/Decline) for pending requests */}
            {notification.status === "pending" && (
              <ActionArea>
                <Button
                  variant="contained"
                  size="small"
                  color="inherit"
                  onClick={() => alert("Decline")}
                >
                  Decline
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => alert("Accept")}
                >
                  Accept
                </Button>
              </ActionArea>
            )}
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
        <Avatar src={userAvatar} alt={user} />
      </AvatarContainer>
      <ContentArea>
        {renderMessage()}
        <NotificationMeta>
          {formatTimeDisplay(timestamp)} • {projectLink}{" "}
          {/* <-- Using the new formatTimeDisplay function */}
        </NotificationMeta>
        {renderContentSpecifics()}
      </ContentArea>
      {/* Read Status Indicator (Red/Gray Dot) */}
      <Box
        sx={{
          flexShrink: 0,
          ml: 2,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: status === "read" ? "grey.300" : "#FF4136",
        }}
      />
    </NotificationItemContainer>
  );
};

// --- Main Notification Drawer Component (unchanged from previous answer) ---

const NotificationDrawer = ({ drawerOpen, setDrawerOpen }) => {
  const [tabValue, setTabValue] = React.useState(0); // 0 for Inbox, 1 for Team

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Example filters - you'd likely have a 'team_related' flag or similar in your real data
  const inboxCount = notifications.filter(
    (n) => n.type !== "team_related"
  ).length;
  const teamCount = notifications.filter(
    (n) => n.type === "team_related"
  ).length;

  return (
    <Drawer className="notification-side-bar"
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
                    {inboxCount}
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
                    {teamCount}
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
        <List disablePadding>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default NotificationDrawer;
