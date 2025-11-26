import React from "react";
import { Avatar, Box, Chip, ListItemButton, Typography } from "@mui/material";

export default function TicketCard({ ticket, selected, onClick }: any) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        mb: 1.5,
        alignItems: "flex-start",
        borderRadius: 2,
        p: 2,
        minHeight: 95,

        backgroundColor: selected ? "#F0F7FF" : "#FFFFFF",
        border: `1px solid ${selected ? "#2F80ED" : "#E7ECF3"}`,
        boxShadow: selected
          ? "0 0 0 2px rgba(47,128,237,0.15)"
          : "0px 1px 3px rgba(0,0,0,0.04)",

        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
          borderColor: "#D5DBE2",
        },
      }}
    >
      {/* AVATAR */}
      <Avatar
        src={ticket.requester?.profile ? `${import.meta.env.VITE_CLOUDFRONT_BASE_URL || "http://localhost:3000/"}${ticket.requester.profile}` : undefined}
        sx={{
          mr: 2,
          width: 42,
          height: 42,
          bgcolor: "#EEF2F7",
          color: "#475467",
          fontWeight: 600,
        }}
      >
        {!ticket.requester?.profile && (ticket.requester?.name?.[0] ?? "?")}
      </Avatar>

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* NAME + TIME */}


        <Typography
          variant="body2"
          noWrap
          sx={{ color: "#374151", mt: 0.3, fontSize: "0.8rem" }}
        >
          {ticket.requester?.displayName || ticket.requester?.fullName || "Unknown User"} ({ticket.requester?.email || "No email"})
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          <Typography
            fontWeight={600}
            noWrap
            sx={{ fontSize: 15, color: "#111827" }}
          >
            {ticket.subject}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap", display: "block", mt: 0.2 }}
        >
          {ticket.timeAgo}
        </Typography>

        {/* SNIPPET */}


        {/* CHIPS */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {/* STATUS CHIP */}
          <Chip
            size="small"
            label={ticket.status}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#E9F3FF",
              color: "#1F5B98",
              fontWeight: 500,
              height: 22,
            }}
          />

          {/* PRIORITY CHIP */}
          <Chip
            size="small"
            label={ticket.priority}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#FFF4E5",
              color: "#D97A05",
              fontWeight: 500,
              height: 22,
              "& .MuiChip-label::before": {
                content: '"●"',
                marginRight: "6px",
                fontSize: "10px",
                lineHeight: 1,
                color: "#D97A05",
              },
            }}
          />

          {/* DEPARTMENT CHIP */}
          <Chip
            size="small"
            label={ticket.department}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#F4F8F0",
              color: "#567A24",
              fontWeight: 500,
              height: 22,
            }}
          />
        </Box>
      </Box>
    </ListItemButton>
  );
}
