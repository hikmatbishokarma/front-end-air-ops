// src/components/QuoteForm.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  StepIconProps,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import moment from "moment";

// Import your step components
import EnquiryStep from "./formSteps/EnquiryStep";
import SectorsStep from "./formSteps/SectorsStep";
import PriceStep from "./formSteps/PriceStep";
import ReviewStep from "./formSteps/ReviewStep";

import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PreviewIcon from "@mui/icons-material/Preview";
import SectorsStepV2 from "./formSteps/SectorsStepv1";
import ClientDialog from "../../clients/pages/dialog";
import RepresentativeDialog from "./representative/dialog";
import { categoryOptions } from "@/shared/utils";
import {
  Iaircraft,
  Iclient,
  Irepresentative,
} from "@/features/quotes/types/interfaces";

interface CustomStepIconProps extends StepIconProps {
  label: string;
}

const stepIcons: { [key: string]: React.ReactElement } = {
  "Flight Plan": <FlightTakeoffIcon />,
  Sectors: <ConnectingAirportsIcon />,
  Price: <CurrencyRupeeIcon />,
  Review: <PreviewIcon />,
};

function CustomStepIcon(props: CustomStepIconProps) {
  const { active, completed } = props;

  // The icon prop passed from Stepper will be the index, which we will ignore.
  // We need to pass the dynamicSteps array down to this component to get the correct label.
  const stepLabel = props.label; // You'll need to pass the label from the parent.

  return (
    <Box
      sx={{
        color: active ? "#0A58CA" : completed ? "#E11D48" : "#bdbdbd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {stepIcons[stepLabel]}
    </Box>
  );
}

const QuoteForm = ({
  initialData,
  onSubmit,
  isEdit,
  aircrafts,
  representatives,
  clients,
  fetchClients,
  fetchRepresentatives,
}: {
  initialData: any;
  onSubmit: (data: any) => void;
  isEdit: boolean;
  aircrafts: Iaircraft[];
  representatives: Irepresentative[];
  clients: Iclient[];
  fetchClients: (searchTerm?: string) => Promise<void>;
  fetchRepresentatives: (clientId: string | undefined) => Promise<void>;
}) => {
  const { control, handleSubmit, watch, reset, getValues, setValue } = useForm({
    defaultValues: initialData || {},
  });

  const [activeStep, setActiveStep] = useState(0);

  const watchedCategory = useWatch({ control, name: "category" });
  const watchedRequestedBy = useWatch({ control, name: "requestedBy" });
  const watchedItinerary = useWatch({ control, name: "itinerary" });
  const watchSectors = useWatch({ control, name: "sectors" });

  const showPriceStep = watchedCategory === "CHARTER";

  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [representativeDialogOpen, setRepresentativeDialogOpen] =
    useState(false);

  // Find the selected client based on the watched form value
  const selectedClient = clients.find((c) => c.id === watchedRequestedBy?.id);

  // Track the last reset ID to prevent unnecessary resets
  const lastResetIdRef = useRef<string | null>(null);

  // Reset form with new initial data when it changes (for edit mode)
  useEffect(() => {
    if (
      initialData &&
      isEdit &&
      initialData.id &&
      initialData.id !== lastResetIdRef.current
    ) {
      // Mark that we've reset for this quote ID
      lastResetIdRef.current = initialData.id;

      // Transform the API response to match form structure
      const transformedData = {
        ...initialData,
        // aircraft is already an object from API, but we need to find it in the list
        aircraft: initialData.aircraft
          ? aircrafts.find((a) => a.id === initialData.aircraft?.id) ||
          initialData.aircraft
          : null,
        // requestedBy is already an object from API, but we need to find it in the list
        requestedBy: initialData.requestedBy
          ? clients.find((c) => c.id === initialData.requestedBy?.id) ||
          initialData.requestedBy
          : null,
        // representative is already an object from API, but we need to find it in the list
        representative: initialData.representative
          ? representatives.find(
            (r) => r.id === initialData.representative?.id
          ) || initialData.representative
          : null,
        // Ensure sectors and prices are arrays
        sectors: initialData.sectors || [],
        prices: initialData.prices || [],
      };
      reset(transformedData);
    }
  }, [initialData, aircrafts, clients, representatives, isEdit, reset]);

  // Update aircraft, requestedBy, and representative when lookup lists are loaded
  useEffect(() => {
    if (initialData && isEdit && aircrafts.length > 0 && clients.length > 0) {
      // Set the aircraft field if it exists in the list
      if (initialData.aircraft?.id) {
        const selectedAircraft = aircrafts.find(
          (a) => a.id === initialData.aircraft.id
        );
        if (selectedAircraft) {
          setValue("aircraft", selectedAircraft, { shouldDirty: false });
        }
      }

      // Set the client field if it exists in the list
      if (initialData.requestedBy?.id) {
        const selectedClient = clients.find(
          (c) => c.id === initialData.requestedBy.id
        );
        if (selectedClient) {
          setValue("requestedBy", selectedClient, { shouldDirty: false });
        }
      }

      // Set the representative field if it exists in the list
      if (initialData.representative?.id && representatives.length > 0) {
        const selectedRepresentative = representatives.find(
          (r) => r.id === initialData.representative.id
        );
        if (selectedRepresentative) {
          setValue("representative", selectedRepresentative, {
            shouldDirty: false,
          });
        }
      }
    }
  }, [initialData, aircrafts, clients, representatives, isEdit, setValue]);

  // Fetch representatives when selected client changes
  useEffect(() => {
    if (selectedClient?.id) {
      fetchRepresentatives(selectedClient.id);
    }
  }, [selectedClient?.id]);

  const dynamicSteps = showPriceStep
    ? ["Flight Plan", "Sectors", "Price", "Review"]
    : ["Flight Plan", "Sectors", "Review"];

  const getStepContent = (stepIndex: number) => {
    switch (dynamicSteps[stepIndex]) {
      case "Flight Plan":
        return (
          <EnquiryStep
            // control={control}
            control={control}
            watchedCategory={watchedCategory} // Pass the watched category
            categoryOptions={categoryOptions} // Pass the data arrays
            aircrafts={aircrafts}
            clients={clients}
            representatives={representatives}
            selectedClient={selectedClient} // Pass the derived state
            setSubDialogOpen={setSubDialogOpen} // Pass the state setters
            setRepresentativeDialogOpen={setRepresentativeDialogOpen}
            isEdit={isEdit}
          />
        );
      case "Sectors":
        return (
          <SectorsStepV2
            control={control}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
          />
        );
      case "Price":
        return (
          <PriceStep
            control={control}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
            sectors={watchSectors}
          />
        );
      case "Review":
        return <ReviewStep allFormValues={watch()} />;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const handleNext = async () => {
    // Add validation logic if needed
    setActiveStep((prevStep) => {
      const nextStepIndex = prevStep + 1;
      if (dynamicSteps[nextStepIndex] === "Price" && !showPriceStep) {
        return nextStepIndex + 1;
      }
      return nextStepIndex;
    });
  };

  const handleBack = () => {
    setActiveStep((prevStep) => {
      const prevStepIndex = prevStep - 1;
      if (dynamicSteps[prevStepIndex] === "Price" && !showPriceStep) {
        return prevStepIndex - 1;
      }
      return prevStepIndex;
    });
  };

  const handleSubDialogClose = async () => {
    setSubDialogOpen(false);
    await fetchClients();
  };

  const handleRepresentativeDialogClose = async () => {
    setRepresentativeDialogOpen(false);
    await fetchRepresentatives(selectedClient?.id);
  };

  return (
    <>
      <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          {/* <Typography component="h1" variant="h4" align="center" gutterBottom>
            Quotation
          </Typography> */}
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ pt: 3, pb: 5 }}
          >
            {dynamicSteps.map((label) => (
              <Step key={label}>
                {/* <StepLabel>{label}</StepLabel> */}
                {/* <StepLabel StepIconComponent={CustomStepIcon}>
                  {label}
                </StepLabel> */}
                <StepLabel
                  StepIconComponent={(props) => (
                    <CustomStepIcon {...props} label={label} />
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <React.Fragment>
            {getStepContent(activeStep)}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button onClick={handleBack} disabled={activeStep === 0}>
                Back
              </Button>
              <Box>
                {activeStep === dynamicSteps.length - 1 ? (
                  <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                    Submit
                  </Button>
                ) : (
                  // <Button variant="contained" onClick={handleNext}>
                  //   Next
                  // </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit(handleNext)} // Use handleSubmit to trigger validation
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </React.Fragment>
        </Paper>
      </Container>

      <ClientDialog
        subDialogOpen={subDialogOpen}
        handleSubDialogClose={handleSubDialogClose}
        clientId={selectedClient?.id}
        // Pass the isEdit prop directly
        isEdit={isEdit}
      />

      <RepresentativeDialog
        dialogOpen={representativeDialogOpen}
        handleDialogClose={handleRepresentativeDialogClose}
        client={selectedClient}
        isEdit={isEdit}
      />
    </>
  );
};

export default QuoteForm;
