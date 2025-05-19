import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  IconButton,
} from "@mui/material";
import { Controller, Control, SubmitHandler } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { GET_AIRCRAFT_CATEGORIES } from "../../lib/graphql/queries/aircraft-categories";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

import FileUpload from "../../components/fileupload";
import Editor from "../../components/Editor";
import MultiFileUpload from "../../components/MultiFileUploader";

interface AircraftCategory {
  id: string;
  name: string;
}

export const BasicInfoStep = ({ control }: { control: any }) => {
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

  return (
    <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
      {/* <Grid item xs={4}>
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
      </Grid> */}
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
              required={true}
              InputLabelProps={{ shrink: !!field.value }}
            />
          )}
        />
      </Grid>
      <Grid item xs={2}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              label="Code"
              fullWidth
              required={true}
              InputLabelProps={{ shrink: !!field.value }}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
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
                  (aircraft: any) => aircraft.id === field.value
                ) || null
              }
              onChange={(_, newValue) =>
                field.onChange(newValue ? newValue.id : "")
              }
              renderInput={(params) => (
                <TextField
                  required={true}
                  {...params}
                  size="small"
                  label="Category"
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="noteText"
          control={control}
          render={({ field }) => (
            // <TextField
            //   {...field}
            //   multiline
            //   size="small"
            //   label="Note Text"
            //   fullWidth
            //   InputLabelProps={{ shrink: !!field.value }}
            // />
            <Editor value={field.value || ""} onChange={field.onChange} />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="warningText"
          control={control}
          render={({ field }) => (
            // <TextField
            //   {...field}
            //   multiline
            //   size="small"
            //   label="Warning Text"
            //   fullWidth
            //   InputLabelProps={{ shrink: !!field.value }}
            // />
            <Editor value={field.value || ""} onChange={field.onChange} />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            // <TextField
            //   {...field}
            //   size="small"
            //   label="Description"
            //   fullWidth
            //   multiline
            //   InputLabelProps={{ shrink: !!field.value }}
            // />
            <Editor value={field.value || ""} onChange={field.onChange} />
          )}
        />
      </Grid>
    </Grid>
  );
};

export const SpecificationStep = ({
  control,
  specificationsField,
  removeSpecification,
  appendSpecification,
}) => (
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
                  required={true}
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
                  required={true}
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
);

export const TermsStep = ({ control }: { control: any }) => (
  <>
    <Grid item xs={12}>
      <Controller
        name="termsAndConditions"
        control={control}
        render={({ field }) => (
          <Editor value={field.value || ""} onChange={field.onChange} />
        )}
      />
    </Grid>
  </>
);

// components/steps/MediaStep.tsx
export const MediaStep = ({ control }: { control: any }) => (
  <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
    <Grid item xs={6}>
      <Controller
        name="flightImages"
        control={control}
        render={({ field }) => (
          <FileUpload
            value={field.value}
            onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
            label="Flight Images"
            category="aircraft"
          />

          // <MultiFileUpload
          //   value={field.value || []}
          //   onUpload={(url) => field.onChange([...(field.value || []), url])}
          //   onChange={field.onChange} // Pass for deletion handling
          //   label="Flight Images"
          //   category="aircraft"
          // />
        )}
      />
    </Grid>
    <Grid item xs={6}>
      <Controller
        name="seatLayoutImage"
        control={control}
        render={({ field }) => (
          <FileUpload
            value={field.value}
            onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
            label="Seat Layout Image"
            category="aircraft"
          />
        )}
      />
    </Grid>
    <Grid item xs={6}>
      <Controller
        name="rangeMapImage"
        control={control}
        render={({ field }) => (
          <FileUpload
            value={field.value}
            onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
            label="Range Map Image"
            category="aircraft"
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="warningImage"
        control={control}
        render={({ field }) => (
          <FileUpload
            value={field.value}
            onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
            label="Warning Image"
            category="aircraft"
          />
        )}
      />
    </Grid>
  </Grid>
);
