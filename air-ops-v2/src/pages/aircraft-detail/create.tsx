import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  CREATE_AIRCRAFT_CATEGORY,
  GET_AIRCRAFT_CATEGORIES,
} from "../../lib/graphql/queries/aircraft-categories";
import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";
import {
  CREATE_AIRCRAFT_DETAIL,
  GET_AIRCRAFT,
} from "../../lib/graphql/queries/aircraft-detail";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FileUpload from "../../components/fileupload";

interface sepcification {
  icon: string;
  name: string;
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
  category: AircraftCategory;
  specifications: sepcification[];
  termsAndConditions: string;
  isActive: boolean;
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
      image: "",
      category: {},
      specifications: [],
      termsAndConditions: "",
      isActive: true,
    },
  });

  const [aircraftCategories, setAircraftCategories] = useState<
    AircraftCategory[]
  >([]);

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

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
    };

    CreateAircraftDetail(formattedData);
    refreshList();
    onClose();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
    >
      {/* Role Type & Name Fields */}
      <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} size="small" label="Name" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField {...field} size="small" label="Code" fullWidth />
            )}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <TextField {...field} size="small" label="Image Url" fullWidth />
            )}
          />
        </Grid> */}
         <Grid item xs={12}>
    <Controller
      name="image"
      control={control}
      render={({ field }) => (
        <FileUpload
          onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
        />
      )}
    />
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
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            )}
          />
        </Grid>
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
      </Grid>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};
