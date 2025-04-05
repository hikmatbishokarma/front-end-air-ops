import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  CREATE_AIRCRAFT_CATEGORY,
  GET_AIRCRAFT_CATEGORIES,
  GET_AIRCRAFT_CATEGORY_BY_ID,
  UPDATE_AIRCRAFT_CATEGORY,
} from "../../lib/graphql/queries/aircraft-categories";
import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";
import {
  GET_AIRCRAFT_DETAIL_BY_ID,
  UPDATE_AIRCRAFT_DETAIL,
} from "../../lib/graphql/queries/aircraft-detail";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  IaircraftCategory,
  Isepcification,
} from "../../interfaces/quote.interface";
import FileUpload from "../../components/fileupload";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";

type FormData = {
  name: string;
  code: string;
  description: string;
  image: string;
  category: any;
  specifications: Isepcification[];
  termsAndConditions: string;
  isActive: boolean;
};

export const AircraftDetailEdit = ({ id, onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const [aircraftDetailData, setAircraftDetailData] = useState<FormData>();
  const [aircraftCategories, setAircraftCategories] = useState<
    IaircraftCategory[]
  >([]);

  const {
    fields: specificationsField,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const fetchAircraftDetailById = async (Id) => {
    const response = await useGql({
      query: GET_AIRCRAFT_DETAIL_BY_ID,
      queryName: "aircraftDetail",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setAircraftDetailData(response);
    }
  };

  useEffect(() => {
    fetchAircraftDetailById(id);
  }, [id]);

  useEffect(() => {
    if (aircraftDetailData) {
      setValue("isActive", aircraftDetailData.isActive || false);
      setValue("name", aircraftDetailData.name || "");
      setValue("code", aircraftDetailData.code || "");
      setValue("description", aircraftDetailData.description || "");
      setValue("category", aircraftDetailData.category.id || "");
      setValue("specifications", aircraftDetailData.specifications || []);
      setValue(
        "termsAndConditions",
        aircraftDetailData.termsAndConditions || "",
      );
    }
  }, [aircraftDetailData, setValue]);

  const UpdateAircraftDetail = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_AIRCRAFT_DETAIL,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
      refreshList();
      onClose();
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
    };

    UpdateAircraftDetail(id, formattedData);
    refreshList();
    onClose();
  };

  const getAircraftCategories = async () => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT_CATEGORIES,
        queryName: "aircraftCategories",
        queryType: "query",
        variables: {},
      });
      setAircraftCategories(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAircraftCategories();
  }, []);

  // return (
  //   <Box
  //     component="form"
  //     onSubmit={handleSubmit(onSubmit)}
  //     sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
  //   >
  //     {/* Role Type & Name Fields */}
  //     <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
  //       <Grid item xs={6}>
  //         <Controller
  //           name="name"
  //           control={control}
  //           render={({ field }) => (
  //             <TextField {...field} size="small" label="Name" fullWidth  InputLabelProps={{ shrink: !!field.value }}  />
  //           )}
  //         />
  //       </Grid>
  //       <Grid item xs={6}>
  //         <Controller
  //           name="code"
  //           control={control}
  //           render={({ field }) => (
  //             <TextField {...field} size="small" label="Code" fullWidth  InputLabelProps={{ shrink: !!field.value }} />
  //           )}
  //         />
  //       </Grid>
  //       <Grid item xs={12}>
  //         <Controller
  //           name="image"
  //           control={control}
  //           render={({ field }) => (
  //             <TextField {...field} size="small" label="Image url" fullWidth  InputLabelProps={{ shrink: !!field.value }} />
  //           )}
  //         />
  //       </Grid>
  //       <Grid item xs={12}>
  //         <Controller
  //           name="description"
  //           control={control}
  //           render={({ field }) => (
  //             <TextField
  //               {...field}
  //               size="small"
  //               label="Description"
  //               fullWidth
  //               multiline
  //               InputLabelProps={{ shrink: !!field.value }}
  //             />
  //           )}
  //         />
  //       </Grid>
  //       <Grid item xs={8}>
  //         <Controller
  //           name="category"
  //           control={control}
  //           render={({ field }) => (
  //             <Autocomplete
  //               {...field}
  //               options={aircraftCategories}
  //               getOptionLabel={(option) => option.name}
  //               value={
  //                 aircraftCategories.find(
  //                   (aircraft: any) => aircraft.id === field.value,
  //                 ) || null
  //               }
  //               onChange={(_, newValue) =>
  //                 field.onChange(newValue ? newValue.id : "")
  //               }
  //               renderInput={(params) => <TextField {...params} size="small" />}
  //             />
  //           )}
  //         />
  //       </Grid>
  //       <Grid item xs={4}>
  //         <Controller
  //           name="isActive"
  //           control={control}
  //           render={({ field }) => (
  //             <FormControlLabel
  //               control={<Switch {...field} defaultChecked size="small" />}
  //               label="isActive"
  //             />
  //           )}
  //         />
  //       </Grid>
  //       <Grid item xs={12}>
  //         <Controller
  //           name="termsAndConditions"
  //           control={control}
  //           render={({ field }) => (
  //             <ReactQuill
  //               {...field}
  //               theme="snow"
  //               value={field.value || ""}
  //               onChange={field.onChange}
  //             />
  //           )}
  //         />
  //       </Grid>
  //     </Grid>

  //     {/* Submit Button */}
  //     <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
  //       <Button type="submit" variant="contained" color="primary">
  //         Submit
  //       </Button>
  //     </Box>
  //   </Box>
  // );

  const steps = [
    "Basic",
    "Itinerary DetailsSpecification",
    "Terms And Condition",
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

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
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
      >
        {activeStep === 0 && (
          <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} defaultChecked size="small" />}
                    label="isActive"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Name"
                    fullWidth
                    InputLabelProps={{ shrink: !!field.value }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Code"
                    fullWidth
                    InputLabelProps={{ shrink: !!field.value }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              {/* <Controller
      name="image"
      control={control}
      render={({ field }) => (
        <FileUpload
          onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
        />
      )}
    /> */}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Description"
                    fullWidth
                    multiline
                    InputLabelProps={{ shrink: !!field.value }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={8}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={aircraftCategories}
                    getOptionLabel={(option) => option.name}
                    value={
                      aircraftCategories.find(
                        (aircraft: any) => aircraft.id === field.value,
                      ) || null
                    }
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.id : "")
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        )}
        {activeStep == 1 && (
          <>
            <Box sx={{ flex: 0.4, pr: 2 }}>
              {specificationsField.map((item, index) => (
                <Grid
                  container
                  spacing={2}
                  key={item.id}
                  alignItems="center"
                  sx={{ mt: 2, borderBottom: "1px solid #ddd", pb: 2 }}
                >
                  <Grid item xs={6}>
                    <Controller
                      name={`specifications.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          label="Title"
                          fullWidth
                          InputLabelProps={{ shrink: !!field.value }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Controller
                      name={`specifications.${index}.value`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          label="Value"
                          fullWidth
                          InputLabelProps={{ shrink: !!field.value }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <IconButton
                      onClick={() => removeSpecification(index)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => appendSpecification({ title: "", value: "" })}
              >
                Add Itinerary
              </Button>
            </Box>
          </>
        )}

        {activeStep == 2 && (
          <>
            <Grid item xs={12}>
              <Controller
                name="termsAndConditions"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    {...field}
                    theme="snow"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>
          </>
        )}

        {/* Submit Button */}
        {/* <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box> */}
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained" color="success">
                Submit
              </Button>
            </Box>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};
