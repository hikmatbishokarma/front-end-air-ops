// import React from "react";
// import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";

// // components/StepperFormLayout.tsx
// export const StepperFormLayout = ({
//   steps,
//   activeStep,
//   handleNext,
//   handleBack,
//   children,
//   onSubmit,
// }: {
//   steps: string[];
//   activeStep: number;
//   handleNext: () => void;
//   handleBack: () => void;
//   children: React.ReactNode;
//   onSubmit: (e: React.FormEvent) => void;
// }) => (
    
//   <>
//     <Stepper activeStep={activeStep} alternativeLabel>
//       {steps.map((label) => (
//         <Step key={label}>
//           <StepLabel>{label}</StepLabel>
//         </Step>
//       ))}
//     </Stepper>

//     <Box
//       component="form"
//       onSubmit={onSubmit}
//       sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
//     >
//       {children}

//       <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
//         <Button disabled={activeStep === 0} onClick={handleBack}>
//           Back
//         </Button>
//         {activeStep === steps.length - 1 ? (
//           <Button type="submit" variant="contained" color="success">
//             Submit
//           </Button>
//         ) : (
//           <Button variant="contained" onClick={handleNext}>
//             Next
//           </Button>
//         )}
//       </Box>
//     </Box>
//   </>
// );



import React from "react";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";

export const StepperFormLayout = ({
  steps,
  activeStep,
  handleNext,
  handleBack,
  children,
  onSubmit,
}: {
  steps: string[];
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const isLastStep = activeStep === steps.length - 1;

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        component="form"
        onSubmit={(e) => {
          if (isLastStep) {
            onSubmit(e); // only submit if it's the last step
          } else {
            e.preventDefault(); // prevent submission on intermediate steps
            handleNext(); // go to next step
          }
        }}
        sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
      >
        {children}

        <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" type="submit">
            {isLastStep ? "Submit" : "Next"}
          </Button>
        </Box>
      </Box>
    </>
  );
};
