import { Box, TextField } from "@mui/material";

interface Props {
  date?: string;
  time?: string;
}

export default function IntimationSendForm({ date, time }: Props) {
  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {date && (
        <TextField
          type="date"
          label="Date"
          defaultValue={date}
          InputLabelProps={{ shrink: true }}
        />
      )}
      <TextField
        type="time"
        label="Time"
        defaultValue={time}
        InputLabelProps={{ shrink: true }}
      />
      <TextField label="Custom Note" fullWidth multiline minRows={2} />
    </Box>
  );
}
