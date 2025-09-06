import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CrewMember, SectorFormValues } from "../../type/trip.type";

// Mock crew list — replace with API (useTrip/useCrew hook)
const mockCrew: CrewMember[] = [
  { id: "c1", name: "Capt. Srinath", designation: "PILOT" },
  { id: "c11", name: "Hikmat", designation: "PILOT" },
  { id: "c12", name: "pooja", designation: "PILOT" },
  { id: "c13", name: "raju", designation: "PILOT" },
  { id: "c2", name: "Capt. Sagar Singh", designation: "PILOT" },
  { id: "c3", name: "Ms Kajal Mishra", designation: "CABIN_CREW" },
  { id: "c4", name: "Mr. Ajay", designation: "ENGINEER" },
  { id: "c5", name: "Mr. Rao", designation: "ENGINEER" },
  { id: "c6", name: "Mr. Shyam", designation: "OPERATIONS" },
  { id: "c7", name: "Mr. Ramesh", designation: "CAMO" },
];

import { Control, Controller } from "react-hook-form";
import { logoColors } from "../../../../../lib/utils";

interface StepCrewProps {
  control: Control<SectorFormValues>;
}

// export default function StepCrew({ control }: StepCrewProps) {
//   const designations: CrewDesignation[] = [
//     "Pilot",
//     "Cabin Crew",
//     "Engineer",
//     "Security",
//     "Operations",
//     "CAMO",
//   ];

//   return (
//     <Box>
//       <Grid container spacing={2}>
//         {designations.map((designation) => (
//           <Grid item xs={12} sm={6} key={designation}>
//             <Controller
//               key={designation}
//               name={`crews.${designation}`} // crew.Pilot, crew.Engineer...
//               control={control}
//               defaultValue={[]} // multiple allowed
//               render={({ field }) => {
//                 const availableCrew = mockCrew.filter(
//                   (c) => c.designation === designation
//                 );
//                 return (
//                   <Autocomplete
//                     multiple
//                     filterSelectedOptions
//                     options={availableCrew}
//                     getOptionLabel={(option) => option.name}
//                     value={field.value || []}
//                     isOptionEqualToValue={(option, value) =>
//                       option.id === value.id
//                     } // 👈 important
//                     onChange={(_, newValue) => field.onChange(newValue)}
//                     renderTags={(value, getTagProps) =>
//                       value.map((option, index) => (
//                         <Chip
//                           {...getTagProps({ index })}
//                           label={option.name}
//                           sx={{
//                             borderRadius: "9999px",
//                             fontWeight: 500,
//                             bgcolor: `${logoColors.primary}15`, // light shade of primary
//                             color: "black", // text in black
//                             borderColor: `${logoColors.primary}40`, // subtle border
//                           }}
//                         />
//                       ))
//                     }
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label={designation}
//                         margin="normal"
//                         size="small"
//                       />
//                     )}
//                   />
//                 );
//               }}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }

const designations = [
  { label: "Pilot", value: "PILOT" },
  { label: "Cabin Crew", value: "CABIN_CREW" },
  { label: "Engineer", value: "ENGINEER" },
  { label: "Security", value: "SECURITY" },
  { label: "Operations", value: "OPERATIONS" },
  { label: "CAMO", value: "CAMO" },
];

export default function StepCrew({ control }: StepCrewProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        {designations.map((d, index) => (
          <>
            <Grid item xs={12} sm={4} key={index}>
              {/* Designation Select */}
              <Controller
                name={`assignedCrews.${index}.designation`}
                control={control}
                defaultValue={d.value}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Designation</InputLabel>
                    <Select {...field} label="Designation">
                      {designations.map((d) => (
                        <MenuItem key={d.value} value={d.value}>
                          {d.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={8} key={index}>
              {/* Crew Multi Select */}
              <Controller
                name={`assignedCrews.${index}.crews`}
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                  const availableCrew = mockCrew.filter(
                    (c) => c.designation === d.value
                  );
                  return (
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      options={availableCrew}
                      getOptionLabel={(option) => option.name}
                      value={
                        availableCrew.filter((c) =>
                          field.value?.includes(c.id)
                        ) || []
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      onChange={
                        (_, newValue) =>
                          field.onChange(newValue.map((c) => c.id)) // save only ids
                      }
                      renderTags={(selected, getTagProps) =>
                        selected.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            label={option.name}
                            sx={{
                              borderRadius: "9999px",
                              fontWeight: 500,
                              bgcolor: `${logoColors.primary}15`,
                              color: "black",
                              borderColor: `${logoColors.primary}40`,
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`${d.label} Crew`}
                          margin="normal"
                          size="small"
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>
          </>
        ))}
      </Grid>
    </Box>
  );
}
