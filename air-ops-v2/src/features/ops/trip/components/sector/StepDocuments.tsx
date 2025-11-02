import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import { useState } from "react";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import { DocumentInfo, SectorFormValues } from "../../type/trip.type";
import { Control, Controller, useFieldArray } from "react-hook-form";

import MediaUpload from "@/components/MediaUpload";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const defaultDocs: DocumentInfo[] = [
  { type: "Flight Plan" },
  { type: "Weight & Balance (CG)" },
  { type: "Tripkit" },
  { type: "Manifest" },
  { type: "Weather Briefing" },
  { type: "NOTAMS" },
  { type: "Helipad Permission" },
  { type: "DGCA Permission" },
];

interface StepDocumentsProps {
  control: Control<SectorFormValues>;
}

export default function StepDocuments({ control }: StepDocumentsProps) {
  const { fields, update, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  // preload default docs if empty
  if (fields.length === 0) {
    defaultDocs.forEach((doc) => append(doc));
  }

  return (
    <Box>
      {fields.map((doc, index) => (
        <Grid
          container
          spacing={2}
          key={doc.id ?? index}
          alignItems="center"
          sx={{ mb: 1 }}
        >
          {/* Label */}
          <Grid item xs={3}>
            <Controller
              name={`documents.${index}.type`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Label"
                  size="small"
                  fullWidth
                  placeholder="Document name"
                />
              )}
            />
          </Grid>

          {/* Link */}
          <Grid item xs={4}>
            <Controller
              name={`documents.${index}.externalLink`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="External Link"
                  size="small"
                  fullWidth
                  placeholder="https://..."
                />
              )}
            />
          </Grid>

          {/* Upload */}
          <Grid item xs={4}>
            <Controller
              name={`documents.${index}.fileUrl`}
              control={control}
              render={({ field }) => (
                <MediaUpload
                  size="medium"
                  label="Upload"
                  category="Trip Detail Docs"
                  accept=".pdf,.doc,.docx"
                  // value={field.value}
                  // onUpload={(url) => field.onChange(url)}
                  value={field.value}
                  onUpload={(fileObject) => field.onChange(fileObject)}
                />
              )}
            />
          </Grid>

          {/* Delete row */}
          <Grid item xs={1}>
            {index >= defaultDocs.length && (
              <IconButton onClick={() => remove(index)} color="error">
                <DeleteIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}

      {/* Add new document row */}
      <IconButton
        onClick={() => append({ type: "", externalLink: "", fileUrl: null })}
        color="error"
      >
        <AddIcon />
      </IconButton>
      {/* <Button
        startIcon={<AddIcon />}
        onClick={() => append({ type: "", externalLink: "", fileUrl: "" })}
        sx={{ mt: 2 }}
      >
        Add Document
      </Button> */}
    </Box>
  );
}
