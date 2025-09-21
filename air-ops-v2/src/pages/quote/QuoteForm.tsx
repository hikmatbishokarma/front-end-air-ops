// src/components/QuoteForm.tsx
import React, { useEffect, useState } from "react";
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

import ClientDialog from "../clients/dialog";
import RepresentativeDialog from "../representative/dialog";
import { categoryOptions } from "../../lib/utils";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PreviewIcon from "@mui/icons-material/Preview";
import SectorsStepV2 from "./formSteps/SectorsStepv1";

// const stepIcons: { [index: string]: React.ReactElement } = {
//   1: <FlightTakeoffIcon />,
//   2: <ConnectingAirportsIcon />,
//   3: <CurrencyRupeeIcon />,
//   4: <PreviewIcon />,
// };

interface CustomStepIconProps extends StepIconProps {
  label: string;
}

const stepIcons: { [key: string]: React.ReactElement } = {
  "Flight Plan": <FlightTakeoffIcon />,
  Sectors: <ConnectingAirportsIcon />,
  Price: <CurrencyRupeeIcon />,
  Review: <PreviewIcon />,
};

// function CustomStepIcon(props: StepIconProps) {
//   const { active, completed, icon } = props;

//   console.log("icon:::", icon);

//   return (
//     <Box
//       sx={{
//         color: active ? "#0A58CA" : completed ? "#E11D48" : "#bdbdbd",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {stepIcons[String(icon)]}
//     </Box>
//   );
// }

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
  aircraftCategories,
}) => {
  const { control, handleSubmit, watch, reset, getValues, setValue } = useForm({
    defaultValues: initialData,
  });

  const [activeStep, setActiveStep] = useState(0);

  const watchedCategory = useWatch({ control, name: "category" });
  const watchedRequestedBy = useWatch({ control, name: "requestedBy" });
  const watchedItinerary = useWatch({ control, name: "itinerary" });

  const showPriceStep = watchedCategory === "CHARTER";

  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [representativeDialogOpen, setRepresentativeDialogOpen] =
    useState(false);

  // Find the selected client based on the watched form value
  const selectedClient = clients.find((c) => c.id === watchedRequestedBy);

  // Reset form with new initial data when it changes (for edit mode)
  // useEffect(() => {
  //   reset(initialData);
  // }, [initialData, reset]);

  useEffect(() => {
    // Check if both the quote data and all lookup lists are available
    if (initialData && aircrafts.length > 0 && clients.length > 0) {
      // Set the aircraft field
      const selectedAircraft = aircrafts.find(
        (a) => a.id === initialData.aircraft
      );
      if (selectedAircraft) {
        setValue("aircraft", selectedAircraft);
      }

      // Set the client field
      const selectedClient = clients.find(
        (c) => c.id === initialData.requestedBy
      );
      if (selectedClient) {
        setValue("requestedBy", selectedClient);
      }
    }
  }, [initialData, aircrafts, clients, setValue]);

  const dynamicSteps = showPriceStep
    ? ["Flight Plan", "Sectors", "Price", "Review"]
    : ["Flight Plan", "Sectors", "Review"];

  const getStepContent = (stepIndex) => {
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
          />
        );
      case "Sectors":
        return (
          // <SectorsStep
          //   control={control}
          //   watch={watch}
          //   getValues={getValues}
          //   setValue={setValue}
          // />

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
            itinerary={watchedItinerary}
          />
        );
      case "Review":
        return (
          <ReviewStep
            allFormValues={watch()}
            clients={clients}
            representatives={representatives}
            aircrafts={aircrafts}
            aircraftCategories={aircraftCategories}
          />
        );
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
