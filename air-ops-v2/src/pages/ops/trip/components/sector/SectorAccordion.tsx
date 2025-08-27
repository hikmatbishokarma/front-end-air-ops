import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Stack,
  Chip,
  Card,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SectorStepper from "./SectorStepper";
import {
  CrewDesignation,
  CrewMember,
  FuelInfo,
  Itinerary,
} from "../../type/trip.type";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { logoColors } from "../../../../../lib/utils";

export interface SectorFormData extends Itinerary {
  crew: Record<CrewDesignation, CrewMember[]>; // multiple crew per designation
  fuel?: FuelInfo;
  documents?: string[];
}

interface SectorAccordionProps {
  index: number;
  sector: Itinerary;
  aircraft?: any;
  expanded: boolean;

  onChange: () => void;
  onSave?: (sectorIndex: number, data: SectorFormData) => void;
}

export default function SectorAccordion({
  index,
  sector,
  aircraft,
  expanded,
  onChange,
  onSave,
}: SectorAccordionProps) {
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      sx={{
        border: expanded
          ? `1px solid ${logoColors.accent}`
          : "1px solid #e0e0e0",
        borderRadius: 2,
        mb: 2,
        transition: "all 0.25s ease-in-out",
        "&:before": { display: "none" },
        boxShadow: expanded ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* <FlightTakeoffIcon sx={{ color: logoColors.primary }} /> */}
          <Chip
            label={`Sector ${index}`}
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

          <Typography fontWeight="bold">
            {sector.source} → {sector.destination}
          </Typography>
          {/* <Typography variant="h6" fontWeight={700} color="text.primary">
            {aircraft?.name}
          </Typography> */}
          {/* <Chip
            label={aircraft?.code}
            size="small"
            sx={{
              ml: 1,
              fontWeight: 700,
              bgcolor: `${logoColors.primary}15`,
              color: logoColors.primary,
              borderColor: `${logoColors.primary}40`,
            }}
            variant="outlined"
          /> */}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {/* Stepper for sector info, crew, fuel, docs */}
          <SectorStepper sector={sector} onSave={onSave} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
