import React, { useEffect, useState } from "react";

import { Controller, useFieldArray, useForm } from "react-hook-form";

import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";
import {
  CREATE_AIRCRAFT_DETAIL,
  GET_AIRCRAFT,
} from "../../lib/graphql/queries/aircraft-detail";

import { StepperFormLayout } from "../../components/StepperFormLayout";
import {
  BasicInfoStep,
  MediaStep,
  SpecificationStep,
  TermsStep,
} from "./children";

interface sepcification {
  title: string;
  value: string;
}

interface AircraftCategory {
  id: string;
  name: string;
}

type FormValues = {
  name: string;
  code: string;
  description: string;
  image: string;
  noteText: string;
  warningText: string;
  category: AircraftCategory;
  specifications: sepcification[];
  termsAndConditions: string;
  isActive: boolean;
  warningImage: string;
  flightImages: [string];
  seatLayoutImage: string;
  rangeMapImage: string;
};

export const AircraftDetailCreate = ({ onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      noteText: "",
      warningText: "",
      category: {},
      specifications: [],
      termsAndConditions: "",
      isActive: true,
      warningImage: "",
      flightImages: [],
      seatLayoutImage: "",
      rangeMapImage: "",
    },
  });

  // const [aircraftCategories, setAircraftCategories] = useState<
  //   AircraftCategory[]
  // >([]);

  // const getAircraftCategories = async () => {
  //   try {
  //     const data = await useGql({
  //       query: GET_AIRCRAFT_CATEGORIES,
  //       queryName: "aircraftCategories",
  //       queryType: "query",
  //       variables: {},
  //     });
  //     setAircraftCategories(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   getAircraftCategories();
  // }, []);

  const CreateAircraftDetail = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_AIRCRAFT_DETAIL,
        queryName: "",
        queryType: "mutation",
        variables: { input: { aircraftDetail: formData } },
      });

      if (!data || data.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar(data?.errors?.[0]?.message, "error");
      }
      showSnackbar("Created Successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formattedData = {
      ...data,
      termandconditions: data.termsAndConditions.replace(/<p><br><\/p>/g, ""),
    };

    await CreateAircraftDetail(formattedData);
    await refreshList();
    onClose();
  };

  const {
    fields: specificationsField,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const steps = ["Basic", "Specification", "Terms And Condition", "media"];

  const [activeStep, setActiveStep] = useState(0);

  // const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  // const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  // return (
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
  //       onSubmit={handleSubmit(onSubmit)}
  //       sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
  //     >
  //       {activeStep === 0 && (
  //         <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
  //           <Grid item xs={4}>
  //             <Controller
  //               name="isActive"
  //               control={control}
  //               render={({ field }) => (
  //                 <FormControlLabel
  //                   control={<Switch {...field} defaultChecked size="small" />}
  //                   label="isActive"
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={6}>
  //             <Controller
  //               name="name"
  //               control={control}
  //               render={({ field }) => (
  //                 <TextField {...field} size="small" label="Name" fullWidth />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={6}>
  //             <Controller
  //               name="code"
  //               control={control}
  //               render={({ field }) => (
  //                 <TextField {...field} size="small" label="Code" fullWidth />
  //               )}
  //             />
  //           </Grid>

  //           <Grid item xs={12}>
  //             <Grid item xs={6}>
  //               <Controller
  //                 name="noteText"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <TextField
  //                     {...field}
  //                     multiline
  //                     size="small"
  //                     label="Name"
  //                     fullWidth
  //                   />
  //                 )}
  //               />
  //             </Grid>
  //             <Grid item xs={6}>
  //               <Controller
  //                 name="warningText"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <TextField
  //                     {...field}
  //                     multiline
  //                     size="small"
  //                     label="Name"
  //                     fullWidth
  //                   />
  //                 )}
  //               />
  //             </Grid>
  //           </Grid>
  //           <Grid item xs={12}>
  //             <Controller
  //               name="description"
  //               control={control}
  //               render={({ field }) => (
  //                 <TextField
  //                   {...field}
  //                   size="small"
  //                   label="Description"
  //                   fullWidth
  //                   multiline
  //                 />
  //               )}
  //             />
  //           </Grid>

  //           <Grid item xs={8}>
  //             <Controller
  //               name="category"
  //               control={control}
  //               render={({ field }) => (
  //                 <Autocomplete
  //                   {...field}
  //                   options={aircraftCategories}
  //                   getOptionLabel={(option) => option.name}
  //                   value={
  //                     aircraftCategories.find(
  //                       (aircraft: any) => aircraft.id === field.value,
  //                     ) || null
  //                   }
  //                   onChange={(_, newValue) =>
  //                     field.onChange(newValue ? newValue.id : "")
  //                   }
  //                   renderInput={(params) => (
  //                     <TextField {...params} size="small" />
  //                   )}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //         </Grid>
  //       )}
  //       {activeStep == 1 && (
  //         <>
  //           <Box sx={{ flex: 0.4, pr: 2 }}>
  //             {specificationsField.map((item, index) => (
  //               <Grid
  //                 container
  //                 spacing={2}
  //                 key={item.id}
  //                 alignItems="center"
  //                 sx={{ mt: 2, borderBottom: "1px solid #ddd", pb: 2 }}
  //               >
  //                 <Grid item xs={6}>
  //                   <Controller
  //                     name={`specifications.${index}.title`}
  //                     control={control}
  //                     render={({ field }) => (
  //                       <TextField
  //                         {...field}
  //                         size="small"
  //                         label="Title"
  //                         fullWidth
  //                       />
  //                     )}
  //                   />
  //                 </Grid>
  //                 <Grid item xs={5}>
  //                   <Controller
  //                     name={`specifications.${index}.value`}
  //                     control={control}
  //                     render={({ field }) => (
  //                       <TextField
  //                         {...field}
  //                         size="small"
  //                         label="Value"
  //                         fullWidth
  //                       />
  //                     )}
  //                   />
  //                 </Grid>

  //                 <Grid item xs={1}>
  //                   <IconButton
  //                     onClick={() => removeSpecification(index)}
  //                     color="error"
  //                   >
  //                     <Delete fontSize="small" />
  //                   </IconButton>
  //                 </Grid>
  //               </Grid>
  //             ))}

  //             <Button
  //               variant="outlined"
  //               startIcon={<AddIcon />}
  //               onClick={() => appendSpecification({ title: "", value: "" })}
  //             >
  //               Add Itinerary
  //             </Button>
  //           </Box>
  //         </>
  //       )}

  //       {activeStep == 2 && (
  //         <>
  //           <Grid item xs={12}>
  //             <Controller
  //               name="termsAndConditions"
  //               control={control}
  //               render={({ field }) => (
  //                 <ReactQuill
  //                   {...field}
  //                   theme="snow"
  //                   value={field.value || ""}
  //                   onChange={field.onChange}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //         </>
  //       )}

  //       {activeStep === 3 && (
  //         <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
  //           <Grid item xs={4}>
  //             <Controller
  //               name="flightImages"
  //               control={control}
  //               render={({ field }) => (
  //                 <FileUpload
  //                   onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={6}>
  //             <Controller
  //               name="seatLayoutImage"
  //               control={control}
  //               render={({ field }) => (
  //                 <FileUpload
  //                   onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={6}>
  //             <Controller
  //               name="rangeMapImage"
  //               control={control}
  //               render={({ field }) => (
  //                 <FileUpload
  //                   onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
  //                 />
  //               )}
  //             />
  //           </Grid>

  //           <Grid item xs={12}>
  //             <Grid item xs={6}>
  //               <Controller
  //                 name="warningImage"
  //                 control={control}
  //                 render={({ field }) => (
  //                   <FileUpload
  //                     onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
  //                   />
  //                 )}
  //               />
  //             </Grid>
  //           </Grid>
  //           <Grid item xs={12}>
  //             <Controller
  //               name="description"
  //               control={control}
  //               render={({ field }) => (
  //                 <TextField
  //                   {...field}
  //                   size="small"
  //                   label="Description"
  //                   fullWidth
  //                   multiline
  //                 />
  //               )}
  //             />
  //           </Grid>
  //         </Grid>
  //       )}

  //       {/* Submit Button */}
  //       {/* <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
  //       <Button type="submit" variant="contained" color="primary">
  //         Submit
  //       </Button>
  //     </Box> */}
  //       <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
  //         <Button disabled={activeStep === 0} onClick={handleBack}>
  //           Back
  //         </Button>
  //         {activeStep === steps.length - 1 ? (
  //           <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
  //             <Button type="submit" variant="contained" color="success">
  //               Submit
  //             </Button>
  //           </Box>
  //         ) : (
  //           <Button variant="contained" onClick={handleNext}>
  //             Next
  //           </Button>
  //         )}
  //       </Box>
  //     </Box>
  //   </>
  // );

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <StepperFormLayout
      steps={steps}
      activeStep={activeStep}
      handleNext={handleNext}
      handleBack={handleBack}
      onSubmit={handleSubmit(onSubmit)}
    >
      {activeStep === 0 && <BasicInfoStep control={control} />}
      {activeStep === 1 && (
        <SpecificationStep
          control={control}
          specificationsField={specificationsField}
          removeSpecification={removeSpecification}
          appendSpecification={appendSpecification}
        />
      )}
      {activeStep === 2 && <TermsStep control={control} />}
      {activeStep === 3 && <MediaStep control={control} />}
    </StepperFormLayout>
  );
};
