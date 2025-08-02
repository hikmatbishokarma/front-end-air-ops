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

const AirportsAutocomplete = ({
  value,
  onChange,
  label,
  isRequired = false,
  error = null,
}: any) => {
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
                { iata_code: { iLike: inputValue } },
                { icao_code: { iLike: inputValue } },
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
      // getOptionLabel={(option) => `${option.iata_code}`}
      getOptionLabel={(option) => `${option.iata_code}, ${option.city}`}
      filterOptions={(opts, params) => {
        const input = params.inputValue.toLowerCase();

        return opts.filter((opt) => {
          return (
            opt.iata_code?.toLowerCase().includes(input) ||
            opt.icao_code?.toLowerCase().includes(input) ||
            opt.name?.toLowerCase().includes(input) ||
            opt.city?.toLowerCase().includes(input)
          );
        });
      }}
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
        <li
          {...props}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{option.iata_code}</span>
          <span>{`${option.city}, ${option.name}`}</span>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          placeholder={label}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          required={isRequired}
          size="small"
          variant="outlined"
          sx={{
            minHeight: "50px",
            "& .MuiInputBase-root": { minHeight: "50px" },
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default AirportsAutocomplete;
