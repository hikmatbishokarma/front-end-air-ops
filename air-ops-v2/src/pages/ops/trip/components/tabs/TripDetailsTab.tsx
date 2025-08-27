import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import SectorAccordion from "../sector/SectorAccordion";
import { Quotation } from "../../type/trip.type";
import { useState } from "react";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { logoColors } from "../../../../../lib/utils";

// Props for TripDetailsTab
interface TripDetailsTabProps {
  quotation: Quotation;
}

const softCard = {
  borderRadius: "20px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2)",
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.06)",
  backdropFilter: "blur(2px)",
};

export default function TripDetailsTab({ quotation }: TripDetailsTabProps) {
  const [expanded, setExpanded] = useState(0);

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 3 },
        background:
          "linear-gradient(135deg, rgba(10,88,202,0.06), rgba(225,29,72,0.06))",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          ...softCard,
          borderColor: "transparent",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88))",
        }}
      >
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <FlightTakeoffIcon sx={{ color: logoColors.primary }} />

                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {quotation?.aircraft?.name}
                </Typography>
                <Chip
                  label={quotation?.aircraft?.code}
                  size="small"
                  sx={{
                    ml: 1,
                    fontWeight: 700,
                    bgcolor: `${logoColors.primary}15`,
                    color: logoColors.primary,
                    borderColor: `${logoColors.primary}40`,
                  }}
                  variant="outlined"
                />
              </Stack>
            </Stack>
          }
          // subheader={
          //   <Typography variant="body2" sx={{ opacity: 0.8 }}>
          //     Add Trip Details.
          //   </Typography>
          // }
          sx={{ pb: 1 }}
        />

        <CardContent sx={{ pt: 0, pb: 2 }}>
          {quotation?.itinerary?.map((sector, index) => (
            <SectorAccordion
              key={index}
              index={index + 1}
              sector={{ ...sector, sectorNo: index + 1 }}
              aircraft={quotation.aircraft}
              expanded={expanded === index}
              onChange={() => setExpanded(expanded === index ? -1 : index)}
              onSave={(sectorNo, data) => {
                // Call PATCH API here
                console.log("TripDetailsTab save:", sectorNo, data);
              }}
            />
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
