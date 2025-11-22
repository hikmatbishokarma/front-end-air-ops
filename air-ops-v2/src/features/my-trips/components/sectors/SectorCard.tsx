// components/sectors/SectorCardPro.tsx
import {
  Box,
  Card,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import LuggageIcon from "@mui/icons-material/Luggage";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { Sector, AircraftInfo } from "../../types/sector";
import { roleForUserInSector } from "../../utils/crew";
import { fmtDate } from "@/shared/utils";
import { useState } from "react";

const ACCENT = "#E53935";
const LIGHT = "#F3F4F6";
const MUTED = "#6B7280";
const RADIUS = 14;

export default function SectorCard({
  sector,
  tripId,
  aircraft,
  currentUserId,
  onOpen,
}: {
  sector: Sector;
  tripId?: string;
  aircraft?: AircraftInfo;
  currentUserId: string;
  onOpen: (tab: "overview" | "crew" | "documents" | "upload") => void;
}) {
  const role = roleForUserInSector(sector, currentUserId);

  const [activeInnerTab, setActiveInnerTab] = useState<
    "overview" | "crew" | "documents" | "upload"
  >("overview");
  const handleOpen = (which: typeof activeInnerTab) => {
    setActiveInnerTab(which);
    onOpen(which);
  };

  return (
    <Card
      //   sx={{
      //     borderRadius: RADIUS,
      //     border: `1.5px solid ${ACCENT}`, // red border (per your request)
      //     boxShadow: "none",
      //     p: 2.5,
      //   }}

      sx={{
        borderRadius: RADIUS,
        border: "1.2px solid #E5E7EB", // light gray default
        boxShadow: "none",
        p: 1.75, // ↓ reduced padding
        transition: "border-color 0.25s ease",
        "&:hover": {
          borderColor: ACCENT, // red only on hover
          cursor: "pointer",
        },
      }}
    >
      {/* top row: airline/aircraft (left), duration rail (center), TripId pill (right) */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        {/* Left brand / aircraft meta */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <AirplanemodeActiveIcon sx={{ fontSize: 22, color: ACCENT }} />
          <Stack spacing={0} sx={{ minWidth: 140 }}>
            <Typography fontWeight={700} fontSize={14}>
              {aircraft || sector.aircraft
                ? (aircraft || sector.aircraft)?.code
                  ? `${(aircraft || sector.aircraft)?.name} (${(aircraft || sector.aircraft)?.code})`
                  : (aircraft || sector.aircraft)?.name
                : "Aircraft"}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <LuggageIcon sx={{ fontSize: 16, color: MUTED }} />
              <EventSeatIcon sx={{ fontSize: 16, color: MUTED }} />
            </Stack>
          </Stack>
        </Stack>

        {/* Center: time rail like screenshot 2 */}
        <Stack alignItems="center" sx={{ flex: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ width: "100%", maxWidth: 480 }}
          >
            <Box>
              <Typography fontWeight={700} fontSize={20}>
                {sector.depatureTime}
              </Typography>
              <Typography fontSize={12} color={MUTED}>
                {fmtDate(sector.depatureDate)}
              </Typography>
              <Typography fontSize={12} color={MUTED}>
                {typeof sector.source === "object"
                  ? sector.source.code
                  : sector.source}
              </Typography>
            </Box>

            {/* rail */}
            <Stack sx={{ flex: 1 }} alignItems="stretch">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{ height: 4, bgcolor: LIGHT, flex: 1, borderRadius: 99 }}
                />
                <FlightIcon
                  sx={{
                    fontSize: 18,
                    transform: "rotate(90deg)",
                    color: ACCENT,
                  }}
                />
                <Box
                  sx={{ height: 4, bgcolor: LIGHT, flex: 1, borderRadius: 99 }}
                />
              </Stack>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={0.5}
                mt={0.5}
              >
                <AccessTimeIcon sx={{ fontSize: 14, color: MUTED }} />
                <Typography fontSize={12} color={MUTED}>
                  {sector.flightTime}
                </Typography>
              </Stack>
            </Stack>

            <Box textAlign="right">
              <Typography fontWeight={700} fontSize={20}>
                {sector.arrivalTime}
              </Typography>
              <Typography fontSize={12} color={MUTED}>
                {fmtDate(sector.arrivalDate)}
              </Typography>
              <Typography fontSize={12} color={MUTED}>
                {typeof sector.destination === "object"
                  ? sector.destination.code
                  : sector.destination}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Right: trip pill (replaces price) */}
        <Chip
          label={`Trip: ${tripId ?? tripId}`}
          sx={{
            bgcolor: "#fff",
            border: `1px solid ${ACCENT}`,
            color: ACCENT,
            fontWeight: 700,
            borderRadius: 999,
            px: 1,
          }}
        />
      </Stack>

      {/* subtle divider */}
      <Divider sx={{ my: 1.5 }} />

      {/* action strip like tabs (outlined gray, minimal) */}
      {/* <Stack direction="row" spacing={1}>
        {[
          ["Overview", "overview"],
          ["Crew", "crew"],
          ["Documents", "documents"],
          ["Upload", "upload"],
        ].map(([label, key]) => (
          //   <Button
          //     key={key}
          //     onClick={() => onOpen(key as any)}
          //     variant="outlined"
          //     sx={{
          //       textTransform: "none",
          //       borderRadius: 10,
          //       borderColor: "#D1D5DB",
          //       color: "#374151",
          //       px: 1.75,
          //       "&:hover": { borderColor: "#9CA3AF", background: "#F9FAFB" },
          //     }}
          //   >
          //     {label}
          //   </Button>

          <Typography
            key={key}
            onClick={() => onOpen(key as any)}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: "#6B7280",
              cursor: "pointer",
              px: 0.5,
              transition: "color 0.2s",
              "&:hover": { color: "#111" },
            }}
          >
            {label}
          </Typography>
        ))}
        <Box flex={1} />
        {role && (
          <Typography variant="caption" color={MUTED}>
            Your Role: <b>{role.replace("_", " ")}</b>
          </Typography>
        )}
      </Stack> */}

      <Stack direction="row" spacing={3} alignItems="center">
        {[
          ["Overview", "overview"],
          ["Crew", "crew"],
          ["Documents", "documents"],
          ["Upload", "upload"],
        ].map(([label, key]) => {
          const isActive = activeInnerTab === key;
          return (
            <Typography
              key={key}
              onClick={() => handleOpen(key as any)}
              sx={{
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#111" : "#6B7280",
                cursor: "pointer",
                pb: 0.75,
                borderBottom: isActive
                  ? "2px solid #E53935"
                  : "2px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
                "&:hover": {
                  color: "#111",
                },
              }}
            >
              {label}
            </Typography>
          );
        })}

        <Box flex={1} />

        {role && (
          <Typography variant="caption" sx={{ color: "#6B7280" }}>
            Your Role: <b>{role.replace("_", " ")}</b>
          </Typography>
        )}
      </Stack>
    </Card>
  );
}
