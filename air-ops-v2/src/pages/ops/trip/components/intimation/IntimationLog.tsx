import { Typography } from "@mui/material";

interface Props {
  status: string;
  lastSent?: string;
}

export default function IntimationLog({ status, lastSent }: Props) {
  return (
    <Typography variant="body2" color="text.secondary">
      {lastSent
        ? `Sent at ${new Date(lastSent).toLocaleTimeString()}, Status: ${status}`
        : `Status: ${status}`}
    </Typography>
  );
}
