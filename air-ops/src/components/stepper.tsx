// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

// export default function HorizontalLinearStepper() {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [skipped, setSkipped] = React.useState(new Set<number>());

//   const isStepOptional = (step: number) => {
//     return step === 1;
//   };

//   const isStepSkipped = (step: number) => {
//     return skipped.has(step);
//   };

//   const handleNext = () => {
//     let newSkipped = skipped;
//     if (isStepSkipped(activeStep)) {
//       newSkipped = new Set(newSkipped.values());
//       newSkipped.delete(activeStep);
//     }

//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     setSkipped(newSkipped);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleSkip = () => {
//     if (!isStepOptional(activeStep)) {
//       // You probably want to guard against something like this,
//       // it should never occur unless someone's actively trying to break something.
//       throw new Error("You can't skip a step that isn't optional.");
//     }

//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     setSkipped((prevSkipped) => {
//       const newSkipped = new Set(prevSkipped.values());
//       newSkipped.add(activeStep);
//       return newSkipped;
//     });
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Stepper activeStep={activeStep}>
//         {steps.map((label, index) => {
//           const stepProps: { completed?: boolean } = {};
//           const labelProps: {
//             optional?: React.ReactNode;
//           } = {};
//           if (isStepOptional(index)) {
//             labelProps.optional = (
//               <Typography variant="caption">Optional</Typography>
//             );
//           }
//           if (isStepSkipped(index)) {
//             stepProps.completed = false;
//           }
//           return (
//             <Step key={label} {...stepProps}>
//               <StepLabel {...labelProps}>{label}</StepLabel>
//             </Step>
//           );
//         })}
//       </Stepper>
//       {activeStep === steps.length ? (
//         <React.Fragment>
//           <Typography sx={{ mt: 2, mb: 1 }}>
//             All steps completed - you&apos;re finished
//           </Typography>
//           <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//             <Box sx={{ flex: '1 1 auto' }} />
//             <Button onClick={handleReset}>Reset</Button>
//           </Box>
//         </React.Fragment>
//       ) : (
//         <React.Fragment>
//           <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
//           <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//             <Button
//               color="inherit"
//               disabled={activeStep === 0}
//               onClick={handleBack}
//               sx={{ mr: 1 }}
//             >
//               Back
//             </Button>
//             <Box sx={{ flex: '1 1 auto' }} />
//             {isStepOptional(activeStep) && (
//               <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
//                 Skip
//               </Button>
//             )}
//             <Button onClick={handleNext}>
//               {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//             </Button>
//           </Box>
//         </React.Fragment>
//       )}
//     </Box>
//   );
// }

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
} from '@mui/material';
import PriceDetails from './price-details';
import FlightInfoStep from './flight-info';
interface FormData {
  source: string;
  destination: string;
  paxNo: number;
  price: any;
  flightInfo: any;
  termsAndConditions: any;
}

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [formData, setFormData] = useState<FormData>({
    source: '',
    destination: '',
    paxNo: 1,
    price: null,
    flightInfo: null,
    termsAndConditions: null,
  });

  const steps = [
    'Flight Segment Input',
    'Fetch Flight Price',
    'Select Flight Info',
    'Submit Data',
  ];

  const [segments, setSegments] = React.useState([
    { from: '', to: '', departureDate: '', arrivalDate: '', pax: '' },
  ]);

  const handleSegmentChange = (index: number, field: string, value: string) => {
    const updatedSegments = [...segments];
    updatedSegments[index][field] = value;
    setSegments(updatedSegments);
  };

  const addSegment = () => {
    if (segments.length < 4) {
      setSegments([
        ...segments,
        { from: '', to: '', departureDate: '', arrivalDate: '', pax: '' },
      ]);
    }
  };

  const removeSegment = (index: number) => {
    const updatedSegments = segments.filter((_, i) => i !== index);
    setSegments(updatedSegments);
  };

  const isStepOptional = (step: number) => step === 1;
  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      source: '',
      destination: '',
      paxNo: 1,
      price: null,
      flightInfo: '',
    });
  };

  const handleSubmit = () => {
    console.log('Submitting Data:', formData);
    alert('Data submitted successfully!');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {segments.map((segment, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                }}
              >
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Segment {index + 1}
                </Typography>

                {/* First Row: From and To */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label='From'
                    name='from'
                    value={segment.from}
                    onChange={(e) =>
                      handleSegmentChange(index, 'from', e.target.value)
                    }
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='To'
                    name='to'
                    value={segment.to}
                    onChange={(e) =>
                      handleSegmentChange(index, 'to', e.target.value)
                    }
                    fullWidth
                    margin='normal'
                  />
                </Box>

                {/* Second Row: Dates and Pax */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label='Departure Date'
                    name='departureDate'
                    type='date'
                    value={segment.departureDate}
                    onChange={(e) =>
                      handleSegmentChange(
                        index,
                        'departureDate',
                        e.target.value
                      )
                    }
                    fullWidth
                    margin='normal'
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label='Arrival Date'
                    name='arrivalDate'
                    type='date'
                    value={segment.arrivalDate}
                    onChange={(e) =>
                      handleSegmentChange(index, 'arrivalDate', e.target.value)
                    }
                    fullWidth
                    margin='normal'
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label='Passengers'
                    name='pax'
                    type='number'
                    value={segment.pax}
                    onChange={(e) =>
                      handleSegmentChange(index, 'pax', e.target.value)
                    }
                    fullWidth
                    margin='normal'
                  />
                </Box>

                {segments.length > 1 && (
                  <Button
                    color='error'
                    onClick={() => removeSegment(index)}
                    sx={{ mt: 2 }}
                  >
                    Remove Segment
                  </Button>
                )}
              </Box>
            ))}

            {segments.length < 4 && (
              <Button variant='outlined' onClick={addSegment} sx={{ mt: 2 }}>
                Add Segment
              </Button>
            )}
          </Box>
        );

      case 1:
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: 2,
              px: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              {/* Left content */}
              <Typography>
                Flight details and other inputs can go here.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexShrink: 0,
              }}
            >
              {/* PriceDetails aligned to the right */}
              {formData.price ? (
                <PriceDetails {...formData.price} />
              ) : (
                <Typography>Loading price details...</Typography>
              )}
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography>Select flight information:</Typography>
            {formData.flightInfo ? (
              <FlightInfoStep flightInfo={formData.flightInfo} />
            ) : (
              <Typography>Loading price details...</Typography>
            )}
          </Box>
        );
      case 3:
        return (
          <Box>
            {formData.flightInfo ? (
              <Typography
                variant='body1'
                component='div'
                dangerouslySetInnerHTML={{
                  __html: formData.termsAndConditions,
                }}
              />
            ) : (
              <Typography>Loading price details...</Typography>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const fetchLatestPrice = async () => {
    const response = await fetch(`http://localhost:3000/prices/latest`);
    const data = await response.json();

    if (data) {
      setFormData((prevData) => ({
        ...prevData,
        price: data,
      }));
    }
  };

  const fetchFlightInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/flight-info`, {
        method: 'POST', // Specify POST method
        headers: {
          'Content-Type': 'application/json', // Ensure the server knows the request body format
        },
        body: JSON.stringify({
          filter: { code: 'VATAA' },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('data:::', data);
      if (data) {
        setFormData((prevData) => ({
          ...prevData,
          flightInfo: data?.data[0], // Assuming data[0] holds the relevant flight information
        }));
      }
    } catch (error) {
      console.error('Failed to fetch flight info:', error);
    }
  };

  const fetchTermsAndConditions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/terms-and-conditions`,
        {
          method: 'POST', // Specify POST method
          headers: {
            'Content-Type': 'application/json', // Ensure the server knows the request body format
          },
          body: JSON.stringify({
            pagination: {
              page: 1,
              perPage: 1,
            },
          }),
        }
      );
      const data = await response.json();
      if (data) {
        setFormData((prevData) => ({
          ...prevData,
          termsAndConditions: data?.data?.[0]?.termsAndConditions, // Assuming data[0] holds the relevant flight information
        }));
      }
    } catch (error) {
      console.error('Failed to fetch terms and conditions:', error);
    }
  };

  useEffect(() => {
    if (activeStep === 1) {
      fetchLatestPrice();
    }
    if (activeStep === 2) {
      fetchFlightInfo();
    }
    if (activeStep === 3) {
      fetchTermsAndConditions();
    }
  }, [activeStep]);

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant='caption'>Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you're finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color='inherit'
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color='inherit' onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
