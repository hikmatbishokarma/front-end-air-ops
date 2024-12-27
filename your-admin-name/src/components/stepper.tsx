import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import { SaveButton, SimpleForm, TextInput, Toolbar } from "react-admin";

const steps = ["Step 1", "Step 2", "Step 3"];

const Step1 = () => (
  <SimpleForm>
    <TextInput source="name" label="Name" />
    <TextInput source="email" label="Email" />
  </SimpleForm>
);

const Step2 = () => (
  <SimpleForm>
    <TextInput source="address" label="Address" />
    <TextInput source="city" label="City" />
  </SimpleForm>
);

const Step3 = () => (
  <SimpleForm>
    <TextInput source="phone" label="Phone Number" />
    <TextInput source="comments" label="Comments" />
  </SimpleForm>
);

const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const formMethods = useForm();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data) => {
    console.log("Form Submitted", data);
  };

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          {activeStep === 0 && <Step1 />}
          {activeStep === 1 && <Step2 />}
          {activeStep === 2 && <Step3 />}

          <Toolbar>
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="contained">
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                variant="contained"
                sx={{ ml: 1 }}
              >
                Next
              </Button>
            ) : (
              <SaveButton
                sx={{ ml: 1 }}
                label="Submit"
                alwaysEnable
                variant="contained"
              />
            )}
          </Toolbar>
        </form>
      </Box>
    </FormProvider>
  );
};

export default StepperForm;
