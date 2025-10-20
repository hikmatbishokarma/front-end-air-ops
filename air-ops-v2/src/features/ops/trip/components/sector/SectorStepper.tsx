import { useState } from "react";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import StepSectorInfo from "./StepSectorInfo";
import StepCrew from "./StepCrew";
import StepFuel from "./StepFuel";
import StepDocuments from "./StepDocuments";

import { useForm } from "react-hook-form";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DescriptionIcon from "@mui/icons-material/Description";

import { StepIconProps } from "@mui/material/StepIcon";
import { Sector } from "../../type/trip.type";
import NoDrinksIcon from "@mui/icons-material/NoDrinks";
import StepBADetails from "./StepBA";
interface SectorStepperProps {
  sector: Sector;
}

const steps = [
  "Sector Info",
  "Crew Selection",
  "BA Details",
  "Fuel Info",
  "Upload Docs",
];

const stepIcons: { [index: string]: React.ReactElement } = {
  1: <FlightTakeoffIcon />,
  2: <GroupsIcon />,
  3: <NoDrinksIcon />,
  4: <LocalGasStationIcon />,
  5: <DescriptionIcon />,
};

function CustomStepIcon(props: StepIconProps) {
  const { active, completed, icon } = props;

  return (
    <Box
      sx={{
        color: active ? "#0A58CA" : completed ? "#E11D48" : "#bdbdbd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {stepIcons[String(icon)]}
    </Box>
  );
}

export default function SectorStepper({ sector, onSave }: any) {
  const [activeStep, setActiveStep] = useState(0);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      ...sector,
      assignedCrews: sector.assignedCrews || [],
      fuelRecord: sector.fuelRecord || {},
      documents: sector.documents || [],
      baInfo: sector.baInfo || {},
    },
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const submitSector = (data: any) => {
    console.log("Saving sector:", sector.sectorNo, data);
    onSave?.(sector.sectorNo, data);
  };

  return (
    <form onSubmit={handleSubmit(submitSector)}>
      <Box mt={2}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              {/* <StepLabel>{label}</StepLabel> */}
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box mt={3}>
          {activeStep === 0 && (
            <StepSectorInfo control={control} sector={sector} />
          )}
          {activeStep === 1 && <StepCrew control={control} />}
          {activeStep === 2 && <StepBADetails control={control} />}
          {activeStep === 3 && <StepFuel control={control} />}
          {activeStep === 4 && <StepDocuments control={control} />}
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="contained" color="success">
              Save Sector
            </Button>
          )}
        </Box>
      </Box>
    </form>
  );
}
