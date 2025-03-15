import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import { GET_AIRPORTS } from "../lib/graphql/queries/airports";
import useGql from "../lib/graphql/gql";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

type Airport = {
  id: string;
  iata_code: string;
  icao_code: string;
  name: string;
  city: string;
};

// const AirportsAutocomplete = ({ value, onChange, label }: any) => {
//   const [inputValue, setInputValue] = useState(""); // Stores user input
//   const [options, setOptions] = useState<Airport[]>([]); // Stores fetched airport options
//   const [loading, setLoading] = useState(false); // Indicates loading state

//   useEffect(() => {
//     const fetchAirports = async () => {
//       if (!inputValue) return; // Skip fetch if input is empty
//       setLoading(true);

//       try {
//         console.log("Fetching airports for:", inputValue);
//         const response = await useGql({
//           query: GET_AIRPORTS,
//           queryName: "airports",
//           queryType: "query",
//           variables: {
//             filter: {
//               or: [
//                 { name: { iLike: inputValue } },
//                 { city: { iLike: inputValue } },
//               ],
//             },
//           },
//         });
//         console.log("API Response:", response);
//         setOptions(response || []);
//       } catch (error) {
//         console.error("Error fetching airports:", error);
//         setOptions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounce = setTimeout(() => {
//       fetchAirports();
//     }, 300);

//     return () => clearTimeout(debounce); // Cleanup debounce on input change
//   }, [inputValue]);

//   console.log("Options state:", options);

//   // Find the selected airport option based on iata_code (field.value)
//   const selectedOption = options.find((opt) => opt.iata_code === value) || null;

//   return (
//     <Autocomplete
//       sx={(theme) => ({
//         display: "inline-block",
//         "& input": {
//           width: "100%",
//           padding: "4px 4px",
//           marginTop: "8px",
//           bgcolor: "background.paper",
//           color: theme.palette.getContrastText(theme.palette.background.paper),
//         },
//       })}
//       getOptionLabel={(option) => `${option.iata_code}`}
//       onInputChange={(event, value) => {
//         setInputValue(value);
//       }}
//       options={options}
//       // value={options.find((opt) => opt.iata_code === value) || null}
//       value={selectedOption}
//       onChange={(_, selectedOption) =>
//         onChange(selectedOption ? selectedOption.iata_code : "")
//       }
//       renderOption={(props, option) => (
//         <li
//           {...props}
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-start",
//           }}
//         >
//           <span style={{ fontWeight: "bold" }}>{option.iata_code}</span>
//           <span>{`${option.city}, ${option.name}`}</span>
//         </li>
//       )}
//       renderInput={(params) => (
//         <div ref={params.InputProps.ref}>
//           <input type="text" {...params.inputProps} />
//         </div>
//       )}
//     />

//     // <Autocomplete
//     //   getOptionLabel={(option) => `${option.iata_code}`} // Display iata_code in the list
//     //   options={options}
//     //   value={selectedOption} // Set the entire airport object as value
//     //   onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Update the input value for searching
//     //   onChange={(_, newValue) => {
//     //     // Update the form value (i.e., airport iata_code)
//     //     onChange(newValue ? newValue.iata_code : "");
//     //   }}
//     //   renderOption={(props, option) => (
//     //     <li
//     //       {...props}
//     //       style={{
//     //         display: "flex",
//     //         flexDirection: "column",
//     //         alignItems: "flex-start",
//     //       }}
//     //     >
//     //       <span style={{ fontWeight: "bold" }}>{option.iata_code}</span>
//     //       <span>{`${option.city}, ${option.name}`}</span>
//     //     </li>
//     //   )}
//     //   renderInput={(params) => <TextField {...params} label={label} />}
//     // />
//   );
// };

const AirportsAutocomplete = ({ value, onChange, label }: any) => {
  const [inputValue, setInputValue] = useState(""); // Stores user input
  const [options, setOptions] = useState<Airport[]>([]); // Stores fetched airport options
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [selectedOption, setSelectedOption] = useState<Airport | null>(null); // Track selected option

  // Fetch airports dynamically based on inputValue
  useEffect(() => {
    const fetchAirports = async () => {
      if (!inputValue) return;
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
              ],
            },
          },
        });

        setOptions(response || []);
      } catch (error) {
        console.error("Error fetching airports:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchAirports, 300); // Debounce API calls

    return () => clearTimeout(debounce);
  }, [inputValue]);

  // Fetch airport by code if editing
  useEffect(() => {
    const fetchAirportByCode = async () => {
      if (!value || options.some((opt) => opt.iata_code === value)) return;

      setLoading(true);
      try {
        const response = await useGql({
          query: GET_AIRPORTS,
          queryName: "airports",
          queryType: "query",
          variables: {
            filter: {
              iata_code: { eq: value },
            },
          },
        });

        if (response.length > 0) {
          setOptions((prevOptions) => [...prevOptions, response[0]]);
          setSelectedOption(response[0]);
          setInputValue(response[0].iata_code);
        }
      } catch (error) {
        console.error("Error fetching airport by code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirportByCode();
  }, [value, options]);

  return (
    <Autocomplete
      sx={(theme) => ({
        display: "inline-block",
        "& input": {
          width: "100%",
          padding: "4px 4px",
          marginTop: "8px",
          bgcolor: "background.paper",
          color: theme.palette.getContrastText(theme.palette.background.paper),
        },
      })}
      getOptionLabel={(option) => `${option.iata_code}`}
      options={options}
      value={selectedOption}
      onInputChange={(event, newValue) => {
        setInputValue(newValue);
      }}
      onChange={(_, selectedOption) => {
        setSelectedOption(selectedOption);
        onChange(selectedOption ? selectedOption.iata_code : "");
        setInputValue(selectedOption ? selectedOption.iata_code : "");
      }}
      renderOption={(props, option) => (
        <li {...props} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ fontWeight: "bold" }}>{option.iata_code}</span>
          <span>{`${option.city}, ${option.name}`}</span>
        </li>
      )}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <input type="text" {...params.inputProps} value={inputValue} />
        </div>
      )}
    />
  );
};



export default AirportsAutocomplete;
