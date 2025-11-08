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
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import { Controller, Control, SubmitHandler } from "react-hook-form";
import useGql from "../../../lib/graphql/gql";
import { GET_AIRCRAFT_CATEGORIES } from "../../../lib/graphql/queries/aircraft-categories";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

import FileUpload from "../../../components/FileUpload";
import Editor from "../../../components/Editor";
import MultiFileUpload from "../../../components/MultiFileUploader";
import { useSession } from "@/app/providers";
import DeleteIcon from "@mui/icons-material/Delete";

export const BasicInfoStep = ({ control }: { control: any }) => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  return (
    <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
      <Grid item xs={6}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              size="small"
              label="Name"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={2}>
        <Controller
          name="code"
          control={control}
          rules={{ required: "Code is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              size="small"
              label="Code"
              fullWidth
              // required={true}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography>Note:</Typography>
        <Controller
          name="noteText"
          control={control}
          render={({ field }) => (
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
}) => {
  // Check if the list is empty
  const isListEmpty = specificationsField.length === 0;

  // Common function for the append action
  const handleAppend = () => appendSpecification({ title: "", value: "" });

  // --- Component JSX ---

  return (
    <Box
    // sx={{
    //   maxWidth: 700,
    //   mx: "auto",
    //   mt: 3,
    //   p: 2,
    //   border: "2px solid #ddd",
    //   borderRadius: 2,
    // }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define the key specifications (e.g., performance, dimensions, capacity)
        for this aircraft category.
      </Typography>

      {/* List of Specifications (Renders only if items exist) */}
      {!isListEmpty && (
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {specificationsField.map((item, index) => (
            <Grid
              container
              spacing={2}
              key={item.id}
              alignItems="center"
              sx={{ mt: 2, borderBottom: "1px solid #ddd", pb: 2 }}
            >
              {/* Title Field */}
              <Grid item xs={5.5}>
                <Controller
                  name={`specifications.${index}.title`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      placeholder="Title"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Value Field */}
              <Grid item xs={5.5}>
                <Controller
                  name={`specifications.${index}.value`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      placeholder="Value"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Delete Button */}
              <Grid item xs={1}>
                <IconButton
                  onClick={() => removeSpecification(index)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Stack>
      )}

      {/* ⭐️ Dynamic Action Area ⭐️ */}
      {isListEmpty ? (
        // --- 1. EMPTY STATE: Centered Full-Width Action ---
        <Box
          onClick={handleAppend}
          sx={{
            p: 4,
            border: "2px dashed #bbb", // Prominent dashed border
            borderRadius: 1,
            textAlign: "center",
            backgroundColor: "#fafafa",
            cursor: "pointer",
            // Optional: Add icon/text vertically centered
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Add Aircraft Specification
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Click here to start defining specifications.
          </Typography>
        </Box>
      ) : (
        // --- 2. POPULATED STATE: Left-Aligned Text Button ---

        <Box sx={{ mt: 2, textAlign: "left" }}>
          <IconButton
            onClick={() => appendSpecification({ title: "", value: "" })}
            size="small"
            color="primary"
            aria-label="add specification" // Still good for accessibility
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

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
export const MediaStep = ({
  control,
  setValue,
  getValues,
}: {
  control: any;
  setValue: any;
  getValues: any;
}) => (
  <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
    <Grid item xs={6}>
      <Controller
        name="flightImage"
        control={control}
        render={({ field }) => (
          <FileUpload
            value={field.value}
            // onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
            onUpload={(fileObject) => field.onChange(fileObject)}
            label="Flight"
            category="aircraft"
          />
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
            // onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
            onUpload={(fileObject) => field.onChange(fileObject)}
            label="Seat Layout"
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
          // <FileUpload
          //   value={field.value}
          //   onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
          //   label="Warning"
          //   category="aircraft"
          // />

          <FileUpload
            // 1. Pass the full S3 object to the component
            value={field.value}
            // 2. The component calls onUpload with the OBJECT: { key, url }
            //    We must update the form state to store this full object.
            onUpload={(fileObject) => field.onChange(fileObject)}
            label="Warning"
            category="aircraft"
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="flightInteriorImages"
        control={control}
        render={({ field }) => (
          <MultiFileUpload
            value={field.value || []}
            // field.onChange handles deletions (single value is array after filtering)
            onChange={field.onChange}
            label="Flight Interior"
            category="flight_media"
            // ⭐️ Simplified: Just pass the RHF field change function
            // The MultiFileUpload component will now handle the array aggregation
            // onUpload={field.onChange} // We will change MultiFileUpload to use this differently
          />
        )}
      />
    </Grid>
  </Grid>
);
