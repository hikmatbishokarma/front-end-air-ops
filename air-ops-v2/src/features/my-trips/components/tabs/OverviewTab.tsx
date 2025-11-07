// components/sectors/tabs/OverviewPro.tsx
import { Box, Stack, Typography, Divider, Chip } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import PowerIcon from "@mui/icons-material/Power";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LuggageIcon from "@mui/icons-material/Luggage";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlightIcon from "@mui/icons-material/Flight";
import { Sector } from "../../types/sector";
import { fmtDate } from "@/shared/utils";

const ACCENT = "#E53935";
const MUTED = "#6B7280";
const LIGHT = "#F3F4F6";

export default function OverviewTab({
  sector,
  aircraftName,
}: {
  sector: Sector;
  aircraftName?: string;
}) {
  return (
    <Box sx={{ p: 2 }}>
      {/* header row similar to screenshot */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={aircraftName ?? "Aircraft"}
            size="small"
            sx={{ bgcolor: LIGHT, color: "#111", fontWeight: 600 }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <LuggageIcon sx={{ fontSize: 18, color: MUTED }} />
            <FastfoodIcon sx={{ fontSize: 18, color: MUTED }} />
            <WifiIcon sx={{ fontSize: 18, color: MUTED }} />
            <PowerIcon sx={{ fontSize: 18, color: MUTED }} />
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccessTimeIcon sx={{ fontSize: 16, color: MUTED }} />
          <Typography fontSize={13} color={MUTED}>
            {sector.flightTime}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* vertical timeline like screenshot 2 */}
      <Stack spacing={3}>
        {/* DEP */}
        <Stack direction="row" spacing={2}>
          <Stack alignItems="center" sx={{ width: 70 }}>
            <Typography fontWeight={700} fontSize={16}>
              {sector.depatureTime}
            </Typography>
            <Typography fontSize={12} color={MUTED}>
              {fmtDate(sector.depatureDate)}
            </Typography>
          </Stack>

          {/* dot & line */}
          <Stack alignItems="center" sx={{ width: 24 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: `2px solid ${ACCENT}`,
                bgcolor: "#fff",
              }}
            />
            <Box sx={{ flex: 1, width: 2, bgcolor: LIGHT, my: 0.5 }} />
          </Stack>

          {/* airport text */}
          <Stack spacing={0}>
            <Typography fontWeight={700} fontSize={15}>
              {sector.source}
            </Typography>
            <Typography fontSize={13} color={MUTED}>
              Departure
            </Typography>
          </Stack>
        </Stack>

        {/* airline line item in the middle */}
        <Stack direction="row" spacing={2}>
          <Box sx={{ width: 70 }} />
          <Stack alignItems="center" sx={{ width: 24 }}>
            <FlightIcon sx={{ fontSize: 18, color: ACCENT }} />
            <Box sx={{ flex: 1, width: 2, bgcolor: LIGHT, my: 0.5 }} />
          </Stack>
          <Stack spacing={0.5}>
            <Typography fontWeight={600} fontSize={14}>
              {aircraftName ?? "Aircraft"}
            </Typography>
            <Typography fontSize={13} color={MUTED}>
              {sector.source} → {sector.destination}
            </Typography>
          </Stack>
        </Stack>

        {/* ARR */}
        <Stack direction="row" spacing={2}>
          <Stack alignItems="center" sx={{ width: 70 }}>
            <Typography fontWeight={700} fontSize={16}>
              {sector.arrivalTime}
            </Typography>
            <Typography fontSize={12} color={MUTED}>
              {fmtDate(sector.arrivalDate)}
            </Typography>
          </Stack>

          <Stack alignItems="center" sx={{ width: 24 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: `2px solid ${ACCENT}`,
                bgcolor: "#fff",
              }}
            />
          </Stack>

          <Stack spacing={0}>
            <Typography fontWeight={700} fontSize={15}>
              {sector.destination}
            </Typography>
            <Typography fontSize={13} color={MUTED}>
              Arrival
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
