// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Switch,
//   FormControlLabel,
//   Autocomplete,
// } from "@mui/material";
// import { GET_AIRCRAFT } from "../lib/graphql/queries/aircraft";
// import useGql from "../lib/graphql/gql";
// import { GET_AIRCRAFT_CATEGORIES } from "../lib/graphql/queries/aircraft-categories";
// import AirportsAutocomplete from "../components/airport-autocommplete";

// const defaultValues = {
//   requestedBy: "",
//   itinerary: [
//     {
//       date: "",
//       time: "",
//       departureOrArrival: "departure",
//       source: "",
//       destination: "",
//       paxNumber: 1,
//     },
//   ],
//   aircraftList: [],
//   providerType: "leon",
//   aircraftCategory: "",
// };

// interface AircraftCategory {
//   id: string;
//   name: string;
// }

// interface Aircraft {
//   id: string;
//   name: string;
//   category: AircraftCategory;
// }

// export default function FlightRequestForm() {
//   const { control, handleSubmit, setValue, watch } = useForm({
//     defaultValues,
//   });

//   const [aircraftCategories, setAircraftCategories] = useState<
//     AircraftCategory[]
//   >([]);
//   const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
//   const [selectedAircraftCategory, setSelectedAircraftCategory] =
//     useState<AircraftCategory | null>(null);

//   const onSubmit = (data: any) => {
//     console.log("Form Data:", data);
//   };

//   const getAircraftCategories = async () => {
//     try {
//       const data = await useGql({
//         query: GET_AIRCRAFT_CATEGORIES,
//         queryName: "aircraftCategories",
//         queryType: "query",
//         variables: {},
//       });
//       setAircraftCategories(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const getAircrafts = async (categoryId) => {
//     try {
//       const data = await useGql({
//         query: GET_AIRCRAFT,
//         queryName: "aircraft",
//         queryType: "query",
//         variables: categoryId
//           ? {
//               sorting: [
//                 {
//                   field: "category",
//                   direction: "ASC",
//                 },
//               ],
//             }
//           : {},
//       });
//       setAircrafts(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     getAircraftCategories();
//     getAircrafts(null);
//   }, []);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
//       <Controller
//         name="requestedBy"
//         control={control}
//         render={({ field }) => (
//           <TextField
//             {...field}
//             label="Requested By"
//             fullWidth
//             margin="normal"
//           />
//         )}
//       />

//       <Controller
//         name="aircraftCategory"
//         control={control}
//         render={({ field }) => (
//           <Autocomplete
//             disablePortal
//             options={aircraftCategories}
//             getOptionLabel={(option) => `${option.name}`}
//             sx={{ width: 300 }}
//             renderInput={(params) => (
//               <TextField {...params} label="Min. Category" />
//             )}
//             onChange={(e, value) => setSelectedAircraftCategory(value)}
//           />
//         )}
//       />

//       <Controller
//         name="aircraftList"
//         control={control}
//         render={({ field }) => (
//           <Autocomplete
//             disablePortal
//             options={aircrafts}
//             getOptionLabel={(option) => `${option.name}`}
//             sx={{ width: 300 }}
//             renderOption={(props, option) => (
//               <li
//                 {...props}
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "flex-start",
//                 }}
//               >
//                 <span>{`${option.category.name}`}</span>
//                 <span style={{ fontWeight: "bold" }}>{option.name}</span>
//               </li>
//             )}
//             renderInput={(params) => <TextField {...params} label="Aircraft" />}
//           />
//         )}
//       />

//       {/* Itinerary Fields */}
//       {watch("itinerary").map((item, index) => (
//         <div
//           key={index}
//           style={{
//             border: "1px solid #ddd",
//             padding: "10px",
//             marginBottom: "10px",
//           }}
//         >
//           <Controller
//             name={`itinerary.${index}.date`}
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Date"
//                 type="date"
//                 fullWidth
//                 margin="normal"
//               />
//             )}
//           />

//           <Controller
//             name={`itinerary.${index}.time`}
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Time"
//                 type="time"
//                 fullWidth
//                 margin="normal"
//               />
//             )}
//           />

//           <Controller
//             name={`itinerary.${index}.source`}
//             control={control}
//             render={({ field }) => (
//             //   <TextField {...field} label="ADEP" fullWidth margin="normal" />
//             <AirportsAutocomplete {...field} label="ADEP" fullWidth margin="normal" />
//             )}
//           />

//           <Controller
//             name={`itinerary.${index}.destination`}
//             control={control}
//             render={({ field }) => (
//             //   <TextField {...field} label="ADES" fullWidth margin="normal" />
//             <AirportsAutocomplete {...field} label="ADES" fullWidth margin="normal"/>
//             )}
//           />

//           <Controller
//             name={`itinerary.${index}.paxNumber`}
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Pax Number"
//                 type="number"
//                 fullWidth
//                 margin="normal"
//               />
//             )}
//           />

//         </div>
//       ))}

//       {/* Submit Button */}
//       <Button type="submit" variant="contained" color="primary">
//         Submit
//       </Button>
//     </form>
//   );
// }

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  TextField,
  Button,
  Autocomplete,
  Grid,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { GET_AIRCRAFT } from "../lib/graphql/queries/aircraft";
import useGql from "../lib/graphql/gql";
import { GET_AIRCRAFT_CATEGORIES } from "../lib/graphql/queries/aircraft-categories";
import AirportsAutocomplete from "../components/airport-autocommplete";

const defaultValues = {
  requestedBy: "",
  itinerary: [
    {
      date: "",
      time: "",
      departureOrArrival: "departure",
      source: "",
      destination: "",
      paxNumber: 1,
    },
  ],
  aircraftList: "",
  providerType: "leon",
  aircraftCategory: "",
};

interface AircraftCategory {
  id: string;
  name: string;
}

interface Aircraft {
  id: string;
  name: string;
  category: AircraftCategory;
}

export default function FlightRequestForm() {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itinerary",
  });

  const [aircraftCategories, setAircraftCategories] = useState<
    AircraftCategory[]
  >([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);

  const [selectedAircraftCategory, setSelectedAircraftCategory] =
    useState<AircraftCategory | null>(null);

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  useEffect(() => {
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
        console.error("Error fetching aircraft categories:", error);
      }
    };

    const getAircrafts = async () => {
      try {
        const data = await useGql({
          query: GET_AIRCRAFT,
          queryName: "aircraft",
          queryType: "query",
          variables: {
            sorting: [{ field: "category", direction: "ASC" }],
          },
        });
        setAircrafts(data);
      } catch (error) {
        console.error("Error fetching aircrafts:", error);
      }
    };

    getAircraftCategories();
    getAircrafts();
  }, []);

  const itinerary = watch("itinerary");

  const addItinerary = () => {
    const lastItinerary = itinerary[itinerary.length - 1];

    const newItinerary = {
      date: "",
      time: "",
      departureOrArrival: "departure",
      source: lastItinerary ? lastItinerary.destination : "",
      destination: "",
      paxNumber: 1,
    };

    console.log("newItinerary", newItinerary);
    // Append the new itinerary to the existing itinerary list
    append(newItinerary);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
      <Controller
        name="requestedBy"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Requested By"
            fullWidth
            margin="normal"
          />
        )}
      />

      <Controller
        name="aircraftCategory"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={aircraftCategories}
            getOptionLabel={(option) => option.name} // Display the category name
            value={selectedAircraftCategory} // Ensure value is the full AircraftCategory object
            onChange={(_, value) => {
              setSelectedAircraftCategory(value); // Set full object on selection
              setValue("aircraftCategory", value ? value.id : ""); // Update form value with category ID
            }}
            renderInput={(params) => (
              <TextField {...params} label="Aircraft Category" />
            )}
          />
        )}
      />

      <Controller
        name="aircraftList"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={aircrafts}
            getOptionLabel={(option) => option.name} // Display the aircraft name
            value={
              field.value
                ? aircrafts.find((aircraft) => aircraft.id === field.value)
                : null
            } // Match the selected aircraft by id
            onChange={(_, value) => {
              // Update form state with the selected aircraft's id
              field.onChange(value ? value.id : ""); // Set the aircraft id in form data
            }}
            renderInput={(params) => <TextField {...params} label="Aircraft" />}
          />
        )}
      />

      {/* Itinerary Fields */}
      {fields.map((item, index) => (
        <Grid
          container
          spacing={2}
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <Grid item xs={3}>
            <Controller
              name={`itinerary.${index}.date`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={2}>
            <Controller
              name={`itinerary.${index}.time`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={2}>
            <Controller
              name={`itinerary.${index}.source`}
              control={control}
              render={({ field }) => (
                <AirportsAutocomplete {...field} label="Source (ADEP)" />
              )}
            />
          </Grid>

          <Grid item xs={2}>
            <Controller
              name={`itinerary.${index}.destination`}
              control={control}
              render={({ field }) => (
                <AirportsAutocomplete {...field} label="Destination (ADES)" />
              )}
            />
          </Grid>

          <Grid item xs={2}>
            <Controller
              name={`itinerary.${index}.paxNumber`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Pax Number"
                  type="number"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={1} container alignItems="center">
            <IconButton onClick={() => remove(index)} color="error">
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Add Itinerary Button */}
      {/* <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() =>
          append({
            date: "",
            time: "",
            departureOrArrival: "departure",
            source: "",
            destination: "",
            paxNumber: 1,
          })
        }
      >
        Add Itinerary
      </Button> */}
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={addItinerary} // Add a new itinerary
      >
        Add Itinerary
      </Button>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="success"
        style={{ marginLeft: "10px" }}
      >
        Submit
      </Button>
    </form>
  );
}
