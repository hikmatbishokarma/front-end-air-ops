import { Avatar, Button, Paper } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import ForwardIcon from "@mui/icons-material/Forward";
import NoteIcon from "@mui/icons-material/Note";

export const ReplyActionBar = ({
  onReplyClick,
  onClose,
}: {
  onReplyClick: () => void;
  onClose: () => void;
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: 1.25,
        bgcolor: "#F6F7F9",
        borderRadius: 2,
        border: "1px solid #E8EBEF",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Avatar
        sx={{ bgcolor: "#E6EDF7", width: 36, height: 36, color: "#0F62FE" }}
      >
        A
      </Avatar>

      <Button
        onClick={onReplyClick}
        startIcon={<ReplyIcon />}
        size="small"
        variant="outlined"
        // sx={{
        //   textTransform: "none",
        //   borderRadius: 1.5,
        //   borderColor: "#DFE7F3",
        //   bgcolor: "#FFFFFF",
        //   color: "#102A43",
        //   "&:hover": { bgcolor: "#F0F4FF" },
        // }}

        sx={{
          textTransform: "none",
          borderRadius: 1.5,
          borderColor: "#DFE7F3",
          bgcolor: "#FFFFFF",
          color: "#102A43 !important",
          "& .MuiButton-startIcon > *": {
            color: "#102A43 !important",
            fill: "#102A43 !important",
          },
          "& svg": { color: "#102A43 !important", fill: "#102A43 !important" },
          "&:hover": { bgcolor: "#F0F4FF" },
        }}
      >
        Reply
      </Button>

      <Button
        startIcon={<NoteIcon />}
        size="small"
        variant="outlined"
        sx={{
          textTransform: "none",
          borderRadius: 1.5,
          borderColor: "#DFE7F3",
          bgcolor: "#FFFFFF",
          color: "#102A43 !important",
          "& .MuiButton-startIcon > *": {
            color: "#102A43 !important",
            fill: "#102A43 !important",
          },
          "& svg": { color: "#102A43 !important", fill: "#102A43 !important" },
          "&:hover": { bgcolor: "#F0F4FF" },
        }}
      >
        Add Note
      </Button>

      <Button
        startIcon={<ForwardIcon />}
        size="small"
        variant="outlined"
        sx={{
          textTransform: "none",
          borderRadius: 1.5,
          borderColor: "#DFE7F3",
          bgcolor: "#FFFFFF",
          color: "#102A43 !important",
          "& .MuiButton-startIcon > *": {
            color: "#102A43 !important",
            fill: "#102A43 !important",
          },
          "& svg": { color: "#102A43 !important", fill: "#102A43 !important" },
          "&:hover": { bgcolor: "#F0F4FF" },
        }}
      >
        Forward
      </Button>
    </Paper>
  );
};
