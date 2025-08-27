import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Chip,
  Grid,
} from "@mui/material";
import {
  CrewDesignation,
  CrewMember,
  SectorFormValues,
} from "../../type/trip.type";

// Mock crew list — replace with API (useTrip/useCrew hook)
const mockCrew: CrewMember[] = [
  { id: "c1", name: "Capt. Srinath", designation: "Pilot" },
  { id: "c11", name: "Hikmat", designation: "Pilot" },
  { id: "c12", name: "pooja", designation: "Pilot" },
  { id: "c13", name: "raju", designation: "Pilot" },
  { id: "c2", name: "Capt. Sagar Singh", designation: "Pilot" },
  { id: "c3", name: "Ms Kajal Mishra", designation: "Cabin Crew" },
  { id: "c4", name: "Mr. Ajay", designation: "Engineer" },
  { id: "c5", name: "Mr. Rao", designation: "Security" },
  { id: "c6", name: "Mr. Shyam", designation: "Operations" },
  { id: "c7", name: "Mr. Ramesh", designation: "CAMO" },
];

import { Control, Controller } from "react-hook-form";
import { logoColors } from "../../../../../lib/utils";

interface StepCrewProps {
  control: Control<SectorFormValues>;
}

export default function StepCrew({ control }: StepCrewProps) {
  const designations: CrewDesignation[] = [
    "Pilot",
    "Cabin Crew",
    "Engineer",
    "Security",
    "Operations",
    "CAMO",
  ];

  return (
    <Box>
      <Grid container spacing={2}>
        {designations.map((designation) => (
          <Grid item xs={12} sm={6} key={designation}>
            <Controller
              key={designation}
              name={`crew.${designation}`} // crew.Pilot, crew.Engineer...
              control={control}
              defaultValue={[]} // multiple allowed
              render={({ field }) => {
                const availableCrew = mockCrew.filter(
                  (c) => c.designation === designation
                );
                return (
                  // <Autocomplete
                  //   multiple
                  //   options={availableCrew}
                  //   filterSelectedOptions
                  //   getOptionLabel={(option) => option.name}
                  //   value={field.value || []}
                  //   onChange={(_, newValue) => field.onChange(newValue)}
                  //   renderInput={(params) => (
                  //     <TextField
                  //       {...params}
                  //       label={designation}
                  //       margin="normal"
                  //       size="small"
                  //     />
                  //   )}
                  //   sx={{ mb: 2 }}
                  // />

                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    options={availableCrew}
                    getOptionLabel={(option) => option.name}
                    value={field.value || []}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    } // 👈 important
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          label={option.name}
                          sx={{
                            borderRadius: "9999px",
                            fontWeight: 500,
                            bgcolor: `${logoColors.primary}15`, // light shade of primary
                            color: "black", // text in black
                            borderColor: `${logoColors.primary}40`, // subtle border
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={designation}
                        margin="normal"
                        size="small"
                      />
                    )}
                  />
                );
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
