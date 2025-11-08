import { Box, Typography, Button, Stack } from "@mui/material";
import IntimationSendForm from "./IntimationSendForm";
import IntimationLog from "./IntimationLog";

interface Props {
  type: "Departure" | "Arrival";
  airport: string;
  recipients: string[];
  date?: string;
  time?: string;
  status: string;
  lastSent?: string;
}

export default function IntimationCard({
  type,
  airport,
  recipients,
  date,
  time,
  status,
  lastSent,
}: Props) {
  return (
    <Box p={2} border="1px solid #ddd" borderRadius={2}>
      <Typography variant="subtitle2" fontWeight="bold">
        {type} Airport: {airport}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Recipients: {recipients.join(", ")}
      </Typography>

      <Box mt={2}>
        <IntimationSendForm date={date} time={time} />
      </Box>

      <Stack direction="row" spacing={1} mt={2}>
        <Button variant="contained" size="small" className="resnd_btn">
          Send
        </Button>
        <Button variant="outlined" size="small" className="resnd_btn">
          Resend
        </Button>
        <Button variant="outlined" color="success" size="small" className="resnd_btn">
          Mark as Confirmed
        </Button>
      </Stack>

      <Box mt={2}>
        <IntimationLog status={status} lastSent={lastSent} />
      </Box>
    </Box>
  );
}
