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
import { IaircraftCategory, Isepcification } from "../../interfaces/quote.interface";




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
      setValue("termsAndConditions", aircraftDetailData.termsAndConditions || "");
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
        <Grid item xs={12}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <TextField {...field} size="small" label="Image url" fullWidth />
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
