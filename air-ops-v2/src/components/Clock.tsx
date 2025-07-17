// ClockDisplay.tsx
import React, { useEffect, useState } from "react";
import { Card, Typography, Box, Grid, Stack } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const getTimeParts = (zone: string) => {
  const date = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: zone,
  });
  const [hour, minute, second] = date.split(":");
  return { hour, minute, second };
};

const TimeBlocks = ({
  hour,
  minute,
  second,
}: {
  hour: string;
  minute: string;
  second: string;
}) => (
  <Stack direction="row" spacing={1} justifyContent="center">
    {[hour, minute, second].map((val, idx) => (
      <Box
        key={idx}
        sx={{
          bgcolor: "white",
          color: "black",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          fontWeight: "bold",
          width: 36,
          textAlign: "center",
          fontSize: "1.2rem",
          fontFamily: "monospace",
        }}
      >
        {val}
      </Box>
    ))}
  </Stack>
);

const ClockDisplay: React.FC = () => {
  const [istTime, setIstTime] = useState(getTimeParts("Asia/Kolkata"));
  const [utcTime, setUtcTime] = useState(getTimeParts("UTC"));

  useEffect(() => {
    const interval = setInterval(() => {
      setIstTime(getTimeParts("Asia/Kolkata"));
      setUtcTime(getTimeParts("UTC"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Card
            sx={{
              backgroundColor: "#e3f2fd",
              color: "#0d47a1",
              p: 2,
              minWidth: 170,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <AccessTimeIcon />
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              IST
            </Typography>
            <TimeBlocks {...istTime} />
          </Card>
        </Grid>
        <Grid item>
          <Card
            sx={{
              backgroundColor: "#f3e5f5",
              color: "#6a1b9a",
              p: 2,
              minWidth: 170,
              textAlign: "center",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <AccessTimeIcon />
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              UTC
            </Typography>
            <TimeBlocks {...utcTime} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClockDisplay;

// Add this to the bottom of ClockDisplay.tsx
export const ClockCompact = () => {
  const [istTime, setIstTime] = useState(getTimeParts("Asia/Kolkata"));
  const [utcTime, setUtcTime] = useState(getTimeParts("UTC"));

  useEffect(() => {
    const interval = setInterval(() => {
      setIstTime(getTimeParts("Asia/Kolkata"));
      setUtcTime(getTimeParts("UTC"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <AccessTimeIcon fontSize="small" />
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          IST {istTime.hour}:{istTime.minute}:{istTime.second}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <AccessTimeIcon fontSize="small" />
        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
          UTC {utcTime.hour}:{utcTime.minute}:{utcTime.second}
        </Typography>
      </Stack>
    </Stack>
  );
};
