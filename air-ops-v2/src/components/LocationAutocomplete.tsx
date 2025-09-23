// import { useEffect, useState } from "react";
// import useGql from "../lib/graphql/gql";
// import { GET_AIRPORTS } from "../lib/graphql/queries/airports";
// import { Autocomplete, TextField } from "@mui/material";

// type Airport = {
//   id: string;
//   iata_code: string;
//   icao_code: string;
//   name: string;
//   city: string;
// };

// const LocationAutocomplete = ({
//   value,
//   onChange,
//   label,
//   isRequired = false,
//   error = null,
// }: any) => {
//   const [inputValue, setInputValue] = useState("");
//   const [options, setOptions] = useState<Airport[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch airports dynamically
//   useEffect(() => {
//     const fetchAirports = async () => {
//       if (!inputValue) return;
//       setLoading(true);

//       try {
//         const response = await useGql({
//           query: GET_AIRPORTS,
//           queryName: "airports",
//           queryType: "query",
//           variables: {
//             filter: {
//               or: [
//                 { name: { iLike: inputValue } },
//                 { city: { iLike: inputValue } },
//                 { iata_code: { iLike: inputValue } },
//                 { icao_code: { iLike: inputValue } },
//               ],
//             },
//           },
//         });

//         setOptions(response || []);
//       } catch (error) {
//         console.error("Error fetching airports:", error);
//         setOptions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounce = setTimeout(fetchAirports, 300);
//     return () => clearTimeout(debounce);
//   }, [inputValue]);

//   return (
//     <Autocomplete
//       getOptionLabel={(option) =>
//         option ? `${option.iata_code}, ${option.city}` : ""
//       }
//       options={options}
//       value={value || null} // now value is the full airport object
//       onInputChange={(_, newValue) => setInputValue(newValue)}
//       onChange={(_, selectedOption) => {
//         onChange(selectedOption); // return full object
//       }}
//       renderOption={(props, option) => (
//         <li {...props} style={{ display: "flex", flexDirection: "column" }}>
//           <span style={{ fontWeight: "bold" }}>{option.iata_code}</span>
//           <span>{`${option.city}, ${option.name}`}</span>
//         </li>
//       )}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label={label}
//           fullWidth
//           placeholder={label}
//           required={isRequired}
//           size="small"
//           error={!!error}
//           helperText={error?.message}
//         />
//       )}
//     />
//   );
// };

import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import useGql from "../lib/graphql/gql";
import { GET_AIRPORTS } from "../lib/graphql/queries/airports";

type Location = {
  code: string; // HYD, BLR, or ZZZZ
  name?: string; // airport/custom name
  city?: string;
  country?: string;
  lat?: number;
  long?: number;
};

type Airport = {
  iata_code: string;
  icao_code: string;
  name: string;
  city: string;
  country?: string;
  lat?: number;
  long?: number;
};

const LocationAutocomplete = ({
  value,
  onChange,
  label,
  isRequired = false,
  error = null,
}: any) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch airports dynamically
  useEffect(() => {
    const fetchAirports = async () => {
      if (!inputValue || inputValue === "ZZZZ") return;
      setLoading(true);

      try {
        const response = await useGql({
          query: GET_AIRPORTS,
          queryName: "airports",
          queryType: "query",
          variables: {
            filter: {
              or: [
                { name: { iLike: inputValue } },
                { city: { iLike: inputValue } },
                { iata_code: { iLike: inputValue } },
                { icao_code: { iLike: inputValue } },
              ],
            },
          },
        });

        setOptions(response || []);
      } catch (err) {
        console.error("Error fetching airports:", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchAirports, 300);
    return () => clearTimeout(debounce);
  }, [inputValue]);

  return (
    <Autocomplete
      options={[
        {
          iata_code: "ZZZZ",
          icao_code: "ZZZZ",
          name: "Heliport",
          city: "",
        },
        ...options,
      ]}
      getOptionLabel={(option) =>
        option.iata_code === "ZZZZ"
          ? "ZZZZ - Heliport"
          : `${option.iata_code}, ${option.city} (${option.name})`
      }
      filterOptions={(opts, params) => {
        const input = params.inputValue.toLowerCase();
        return opts.filter(
          (opt) =>
            opt.iata_code.toLowerCase().includes(input) ||
            opt.icao_code?.toLowerCase().includes(input) ||
            opt.name.toLowerCase().includes(input) ||
            opt.city?.toLowerCase().includes(input)
        );
      }}
      value={
        value?.code
          ? value.code === "ZZZZ"
            ? { iata_code: "ZZZZ", name: "Heliport", city: "" }
            : {
                iata_code: value.code,
                name: value.name,
                city: value.city,
              }
          : null
      }
      onInputChange={(_, newValue) => setInputValue(newValue)}
      onChange={(_, selected) => {
        if (!selected) {
          onChange(null);
          return;
        }

        if (selected.iata_code === "ZZZZ") {
          onChange({ code: "ZZZZ" }); // custom card will handle name/lat/long
        } else {
          onChange({
            code: selected.iata_code,
            name: selected.name,
            city: selected.city,
            country: selected.country,
            lat: selected.lat,
            long: selected.long,
          });
        }
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={isRequired}
          fullWidth
          size="small"
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default LocationAutocomplete;
