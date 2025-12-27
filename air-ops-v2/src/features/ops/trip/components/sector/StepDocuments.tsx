import { Box, TextField, IconButton, Grid, Tooltip, Paper } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { DocumentInfo, SectorFormValues } from "../../type/trip.type";
import { Control, Controller, useFieldArray, useWatch } from "react-hook-form";

import MediaUpload from "@/components/MediaUpload";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PassengerManifestPreview from "../PassengerManifestPreview";

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

// Mapping of document types to predefined external links
const documentTypeLinks: Record<string, string> = {
  "Flight Plan": "https://onlinefpl.aai.aero/ofpl/#/Login",
  "Weather Briefing":
    "https://olbs.amssdelhi.gov.in/nsweb/FlightBriefing/#showFlightOverview",
};

interface StepDocumentsProps {
  control: Control<SectorFormValues>;
  tripId?: string;
  sectorNo?: number;
}

export default function StepDocuments({ control, tripId, sectorNo }: StepDocumentsProps) {


  const [manifestDialogOpen, setManifestDialogOpen] = useState(false);
  const { fields, update, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const documents = useWatch({ control, name: "documents" });

  // preload default docs if empty
  if (fields.length === 0) {
    defaultDocs.forEach((doc) => append(doc));
  }

  // Auto-update external links when document type changes
  useEffect(() => {
    if (documents) {
      documents.forEach((doc: DocumentInfo, index: number) => {
        if (doc.type && documentTypeLinks[doc.type]) {
          const predefinedLink = documentTypeLinks[doc.type];
          if (doc.externalLink !== predefinedLink) {
            update(index, { ...doc, externalLink: predefinedLink });
          }
        }
      });
    }
  }, [documents, update]);

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
              render={({ field }) => {
                const docType = fields[index]?.type || "";
                const isManifest = docType === "Manifest";

                // For Manifest, show icon button
                if (isManifest) {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <Tooltip title="View Passenger Manifest" arrow>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setManifestDialogOpen(true);
                          }}
                          sx={{
                            "&:hover": {
                              backgroundColor: "primary.light",
                              color: "primary.contrastText",
                            },
                          }}
                        >
                          <AssignmentOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                }

                // For other documents, show external link logic
                const predefinedLink = documentTypeLinks[docType];
                const linkUrl = predefinedLink || field.value || "";
                const hasLink = Boolean(linkUrl);

                return (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    {hasLink ? (
                      <Tooltip title={`Open ${docType} link`} arrow>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              linkUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          sx={{
                            "&:hover": {
                              backgroundColor: "primary.light",
                              color: "primary.contrastText",
                            },
                          }}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="No external link available" arrow>
                        <IconButton disabled sx={{ cursor: "not-allowed" }}>
                          <LinkOffIcon sx={{ color: "text.disabled" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                );
              }}
            />
          </Grid>

          {/* Upload */}
          <Grid item xs={4}>
            <Controller
              name={`documents.${index}.fileUrl`}
              control={control}
              render={({ field }) => {
                // Convert string (key from backend) to object for MediaUpload display
                // Backend stores fileUrl as string (key), but MediaUpload expects FileObject
                const displayValue =
                  typeof field.value === "string" && field.value
                    ? { key: field.value, url: field.value } // Convert string to object
                    : field.value; // If already object or null, use as is

                return (
                  <MediaUpload
                    size="medium"
                    label="Upload"
                    category="Trip Detail Docs"
                    accept=".pdf,.doc,.docx"
                    value={displayValue} // Pass object to MediaUpload
                    onUpload={(fileObject) => {
                      // Save only the key string to backend (not the full object)
                      const keyValue = fileObject?.key || null;
                      field.onChange(keyValue);
                    }}
                  />
                );
              }}
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

      {/* Manifest Preview Dialog */}
      {tripId && sectorNo && (
        <PassengerManifestPreview
          tripId={tripId}
          sectorNo={sectorNo}
          open={manifestDialogOpen}
          onClose={() => setManifestDialogOpen(false)}
        />
      )}
    </Box>
  );
}
