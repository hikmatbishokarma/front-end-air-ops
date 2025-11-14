// src/features/support/layout/SupportLayout.tsx
import { Box } from "@mui/material";

export default function SupportLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* LEFT */}
      <Box sx={{ width: 380, borderRight: "1px solid #E5E7EB" }}>{left}</Box>

      {/* RIGHT */}
      <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "#FFFFFF" }}>{right}</Box>
    </Box>
  );
}
