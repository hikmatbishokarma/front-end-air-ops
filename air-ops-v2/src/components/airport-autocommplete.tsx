import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import { GET_AIRPORTS } from "../lib/graphql/queries/airports";
import useGql from "../lib/graphql/gql";

type Airport = {
  id: string;
  iata_code: string;
  icao_code: string;
  name: string;
  city: string;
};

const AirportsAutocomplete = ({label}) => {
  const [inputValue, setInputValue] = useState(""); // Stores user input
  const [options, setOptions] = useState<Airport[]>([]); // Stores fetched airport options
  const [loading, setLoading] = useState(false); // Indicates loading state

  useEffect(() => {
    const fetchAirports = async () => {
      if (!inputValue) return; // Skip fetch if input is empty
      setLoading(true);

      try {
        console.log("Fetching airports for:", inputValue);
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
        console.log("API Response:", response);
        setOptions(response || []);
      } catch (error) {
        console.error("Error fetching airports:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchAirports();
    }, 300);

    return () => clearTimeout(debounce); // Cleanup debounce on input change
  }, [inputValue]);

  console.log("Options state:", options);

  return (
    <Autocomplete
    sx={(theme) => ({
        display: 'inline-block',
        '& input': {
          width: 200,
          bgcolor: 'background.paper',
          color: theme.palette.getContrastText(theme.palette.background.paper),
        },
      })}
      disableClearable
      options={options}
      getOptionLabel={(option) => `${option.iata_code}`}
      isOptionEqualToValue={(option, value) => option.id === value.id} // Ensure proper equality check
      onInputChange={(event, value) => {
        setInputValue(value);
      }}
      loading={loading}
      renderOption={(props, option) => (
        <li {...props} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start"  }}>
          <span style={{ fontWeight: "bold" }}>{option.iata_code}</span>
          <span>{`${option.city}, ${option.name}`}</span>
        </li>
      )}

    renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default AirportsAutocomplete;
