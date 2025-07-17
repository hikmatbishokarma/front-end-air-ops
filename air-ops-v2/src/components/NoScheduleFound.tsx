// NoScheduleFound.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";

// Assuming plan.gif is in your public folder, e.g., public/plan.gif
// If you're using a module bundler and your image is in src/, you might import it like:
// import planGif from '../../assets/plan.gif'; // Adjust path as needed

interface NoScheduleFoundProps {
  onCheckCalendar?: () => void; // Made optional as discussed
}

const NoScheduleFound: React.FC<NoScheduleFoundProps> = ({
  onCheckCalendar,
}) => {
  const gifSrc = `${import.meta.env.BASE_URL}plane.gif`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", // Occupy full height of parent
        textAlign: "center",
        p: 2, // Slightly less padding for a widget
        color: "text.secondary",
      }}
    >
      {/* Your plan.gif image */}
      <img
        src={gifSrc} // Use the PUBLIC_URL variable here!
        alt="No flight schedule"
        style={{ maxWidth: "120px", height: "auto", marginBottom: 16 }} // Slightly smaller image for widget
      />

      {/* Main Text */}
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontWeight: "medium" }}
      >
        No flight schedule for the day
      </Typography>

      {/* The button is optional for this widget context, as the calendar is already beside it.
          If you still want it to navigate to a different "full calendar" page,
          uncomment and provide the onCheckCalendar prop.
      {onCheckCalendar && (
        <Button
          variant="contained"
          color="primary"
          onClick={onCheckCalendar}
          sx={{ mt: 2 }} // Margin top for spacing
        >
          Check Full Calendar
        </Button>
      )}
      */}
    </Box>
  );
};

export default NoScheduleFound;
