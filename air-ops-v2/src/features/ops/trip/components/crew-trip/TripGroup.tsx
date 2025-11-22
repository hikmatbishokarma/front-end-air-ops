import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SectorRow } from "./SectorRow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
export const TripRow = ({ trip }) => {
  const [open, setOpen] = useState(false);

  const aircraftName = trip.quotation?.aircraft?.name ?? "-";
  const aircraftCode = trip.quotation?.aircraft?.code ?? "-";

  return (
    <>
      {/* Trip Header Row */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          p: 2,
          background: "#F5F5F5",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          mb: 1,
        }}
      >
        <Box>
          <Typography fontWeight={600}>Trip {trip.tripId}</Typography>

          <Typography fontSize={13} color="text.secondary">
            {trip.quotationNo} • {aircraftName} ({aircraftCode})
          </Typography>
        </Box>

        <Typography fontSize={13} color="text.secondary">
          Created: {new Date(trip.createdAt).toLocaleDateString()}
        </Typography>

        <IconButton size="small">
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Sectors */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table sx={{ mb: 2 }}>
          <TableBody>
            {trip.sectors.map((sector) => (
              <SectorRow key={sector._id} sector={sector} />
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </>
  );
};
