import { Avatar, Stack, Typography } from "@mui/material";
import { deepOrange, grey } from "@mui/material/colors";
import UserIcon from "@mui/icons-material/Person";

export const UserAvatarCell = ({ user }) => {
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    let initials = "";
    if (parts.length > 0) {
      initials += parts[0][0];
    }
    if (parts.length > 1) {
      initials += parts[1][0];
    }
    return initials.toUpperCase();
  };

  const renderAvatar = () => {
    // Case 1: User has a profile picture
    if (user && user.profilePicUrl) {
      return (
        <Avatar
          alt={user.name ? `${user.name}'s avatar` : "User avatar"}
          src={user.profilePicUrl}
        />
      );
    }
    // Case 2: User has a name, but no profile picture
    if (user && user.name) {
      return (
        <Avatar sx={{ bgcolor: deepOrange[500] }}>
          {getInitials(user.name)}
        </Avatar>
      );
    }
    // Case 3: No user data is available
    return (
      <Avatar sx={{ bgcolor: grey[500] }}>
        <UserIcon />
      </Avatar>
    );
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2} p={1}>
      {renderAvatar()}
      {user && user.name && (
        <Typography variant="body1" component="span">
          {user.name}
        </Typography>
      )}
      {/* {!user && (
        <Typography variant="body1" component="span" sx={{ color: grey[600] }}>
          No user
        </Typography>
      )} */}
    </Stack>
  );
};

export const UserAvatar = ({ user }) => {
  // A helper function to get the initials from a name.
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    let initials = "";
    if (parts.length > 0) {
      initials += parts[0][0];
    }
    if (parts.length > 1) {
      initials += parts[1][0];
    }
    return initials.toUpperCase();
  };

  // A function to render the appropriate avatar based on user data.
  const renderAvatar = () => {
    // Case 1: User has a profile picture.
    if (user && user.profilePicUrl) {
      return (
        <Avatar
          alt={user.name ? `${user.name}'s avatar` : "User avatar"}
          src={user.profilePicUrl}
          sx={{ width: 24, height: 24 }} // Reduced size
        />
      );
    }
    // Case 2: User has a name, but no profile picture.
    if (user && user.name) {
      return (
        <Avatar
          sx={{ bgcolor: deepOrange[500], width: 24, height: 24, fontSize: 12 }}
        >
          {" "}
          // Reduced size and font size
          {getInitials(user.name)}
        </Avatar>
      );
    }
    // Case 3: No user data is available.
    return (
      <Avatar sx={{ bgcolor: grey[500], width: 24, height: 24 }}>
        {" "}
        // Reduced size
        <UserIcon sx={{ fontSize: 16 }} /> // Reduced icon size
      </Avatar>
    );
  };

  // Render only the avatar.
  return (
    <Stack direction="row" alignItems="center" p={1}>
      {renderAvatar()}
    </Stack>
  );
};
