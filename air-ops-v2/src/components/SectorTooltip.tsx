import React from "react";
import {
  Tooltip,
  styled,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
} from "@mui/material";
import { Flight, AccessTime } from "@mui/icons-material"; // Assuming these are from @mui/icons-material
import moment from "moment"; // Assuming moment.js is available in your project
import { flightBlockTime } from "../lib/utils";

// IMPORTANT: Define the type for the individual sector object
interface Sector {
  source: { code: string; name: string };
  destination: { code: string; name: string };
  depatureTime: string;
  arrivalTime: string;
  depatureDate: string;
  arrivalDate: string;
  paxNumber: number;
  // Add any other properties used in the component
}

// Props interface for the new component
interface SectorTooltipProps {
  sectors: Sector[];
}

// 1. Styled Tooltip Definition
const StyledTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#fff",
    color: "#333",
    maxWidth: 970,
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    padding: 0,
  },
}));

// 2. The Reusable Component
export const SectorTooltip: React.FC<SectorTooltipProps> = ({ sectors }) => {
  if (!sectors || sectors.length === 0) return <Typography>N/A</Typography>;

  const start = sectors?.[0]?.source?.code || "";
  const end = sectors?.[sectors.length - 1]?.destination?.code || "";
  const totalPax = sectors.reduce(
    (acc: number, s: any) => acc + (s.paxNumber || 0),
    0
  );

  return (
    <StyledTooltip
      title={
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            minWidth: 400,
            maxWidth: 970,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            {sectors.map((s: Sector, i: number) => (
              <Box key={i} sx={{ mb: i < sectors.length - 1 ? 2 : 0 }}>
                {/* Route row */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {/* Source */}
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {s?.source?.code || ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s?.source?.name || ""}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {s.depatureTime}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moment(s.depatureDate).format("dddd, MMM D")}
                    </Typography>
                  </Box>

                  {/* Flight icon */}
                  <Box textAlign="center" mx={2}>
                    <Flight sx={{ fontSize: 20, transform: "rotate(90deg)" }} />
                  </Box>

                  {/* Destination */}
                  <Box textAlign="right">
                    <Typography variant="h6" fontWeight={700}>
                      {s?.destination?.code || ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s?.destination?.name ?? ""}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {s.arrivalTime}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moment(s.arrivalDate).format("dddd, MMM D")}
                    </Typography>
                  </Box>
                </Box>

                {/* Pax + duration row */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    color="text.secondary"
                    sx={{
                      background: "#f0f0f0",
                      px: 1,
                      borderRadius: "6px",
                    }}
                  >
                    <AccessTime fontSize="small" />
                    <Typography variant="caption">
                      {/* Pass the single sector in an array to flightBlockTime */}
                      {flightBlockTime([s])}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      background: "#f0f0f0",
                      px: 1,
                      borderRadius: "6px",
                    }}
                  >
                    👤 {s.paxNumber || 0} Pax
                  </Typography>
                </Box>

                {i < sectors.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      }
      arrow
      placement="top"
    >
      <Box sx={{ cursor: "pointer", color: "#1976d2" }}>
        <Typography variant="body2" fontWeight={600}>
          {start} → {end} | 👤 {totalPax} Pax
        </Typography>
      </Box>
    </StyledTooltip>
  );
};

export default SectorTooltip;
