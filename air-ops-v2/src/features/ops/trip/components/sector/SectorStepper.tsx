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

import { useForm, FormProvider } from "react-hook-form";
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
  tripId?: string;
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

export default function SectorStepper({ sector, tripId, onSave }: any) {
  const [activeStep, setActiveStep] = useState(0);

  // Transform documents from backend format (fileUrl as string) to form format
  const transformedDocuments = (sector.documents || []).map((doc: any) => ({
    ...doc,
    // Keep fileUrl as string (key) - MediaUpload will handle conversion for display
    fileUrl: doc.fileUrl || null,
  }));

  const methods = useForm({
    defaultValues: {
      ...sector,
      assignedCrews: sector.assignedCrews || [],
      fuelRecord: sector.fuelRecord || {},
      documents: transformedDocuments,
      baInfo: sector.baInfo || {},
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = methods;

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveStep((prev) => prev - 1);
  };

  const submitSector = (data: any) => {
    // Transform documents to ensure fileUrl is a string (key) not an object
    const transformedData = {
      ...data,
      documents:
        data.documents?.map((doc: any) => ({
          ...doc,
          fileUrl:
            typeof doc.fileUrl === "object" && doc.fileUrl?.key
              ? doc.fileUrl.key // Extract key string from object
              : doc.fileUrl || null, // Keep as string or null
        })) || [],
      fuelRecord: {
        ...data.fuelRecord,
        fuelReceipt:
          typeof data.fuelRecord?.fuelReceipt === "object" &&
            data.fuelRecord?.fuelReceipt?.key
            ? data.fuelRecord.fuelReceipt.key // Extract key string from object
            : data.fuelRecord?.fuelReceipt || null, // Keep as string or null
      },
    };
    console.log("Saving sector:", sector.sectorNo, transformedData);
    onSave?.(sector.sectorNo, transformedData);
  };

  // Prevent form submission unless we're on the last step
  const handleFormSubmit = (e: React.FormEvent) => {
    // Only allow submission on the last step
    if (activeStep !== steps.length - 1) {
      // Prevent submission on all steps except the last one
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // On last step, let react-hook-form handle the submission
    // Don't prevent default here, let handleSubmit handle it
    handleSubmit(submitSector)(e);
  };

  // Prevent Enter key from submitting form on non-last steps
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && activeStep < steps.length - 1) {
      e.preventDefault();
      e.stopPropagation();
      // Optionally move to next step on Enter
      // handleNext();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
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
            {activeStep === 3 && <StepFuel control={control} setValue={setValue} />}
            {activeStep === 4 && <StepDocuments control={control} tripId={tripId} sectorNo={sector.sectorNo} />}
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              type="button"
              disabled={activeStep === 0}
              onClick={(e) => handleBack(e)}
            >
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                variant="contained"
                onClick={(e) => handleNext(e)}
              >
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
    </FormProvider>
  );
}
