import { Box, Typography } from "@mui/material";
import IntimationCard from "../intimation/IntimationCard";
import { Quotation } from "../../type/trip.type";

// Mock data — later fetch via useTrip hook
const mockSectors = [
  {
    id: 1,
    from: "HYD",
    to: "DEL",
    departure: {
      airport: "HYD",
      recipients: ["APD", "ATCfuel", "Terminal"],
      date: "2025-08-15",
      time: "10:30",
      status: "Pending",
      lastSent: "2025-08-15T10:10:00Z",
    },
    arrival: {
      airport: "DEL",
      recipients: ["Terminal", "Ground Handler"],
      time: "11:45",
      status: "Not Sent",
    },
  },
];

interface TripDetailsTabProps {
  quotation: Quotation;
}

export default function IntimationsTab({ quotation }: TripDetailsTabProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Intimations
      </Typography>

      {mockSectors.map((sector) => (
        <Box key={sector.id} mb={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Sector {sector.from} → {sector.to}
          </Typography>

          <Box mt={2}>
            <IntimationCard
              type="Departure"
              airport={sector.departure.airport}
              recipients={sector.departure.recipients}
              date={sector.departure.date}
              time={sector.departure.time}
              status={sector.departure.status}
              lastSent={sector.departure.lastSent}
            />

            <Box mt={2}>
              <IntimationCard
                type="Arrival"
                airport={sector.arrival.airport}
                recipients={sector.arrival.recipients}
                time={sector.arrival.time}
                status={sector.arrival.status}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
