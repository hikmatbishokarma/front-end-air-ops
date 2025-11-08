import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";

import useGql from "../lib/graphql/gql";
import { GET_STATES } from "../lib/graphql/queries/state";

export type IState = {
  id: string;
  name: string;
  isoCode: string;
};

const StateAutocomplete = ({
  value,
  onChange,
  label,
  error = null,
  helperText = null,
}: any) => {
  const [inputValue, setInputValue] = useState(""); // Stores user input
  const [options, setOptions] = useState<IState[]>([]); // Stores fetched state options
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [selectedOption, setSelectedOption] = useState<IState | null>(null); // Track selected option

  // Helper function to parse "Name(ISO)" format and extract name
  const parseStateValue = (stateValue: string): string => {
    if (!stateValue) return "";
    // Check if value is in "Name(ISO)" format
    const match = stateValue.match(/^(.+?)\(([^)]+)\)$/);
    if (match) {
      return match[1].trim(); // Return just the name part
    }
    return stateValue; // Return as is if not in expected format
  };

  // Helper function to format state as "Name(ISO)"
  const formatStateValue = (state: IState): string => {
    return state.isoCode ? `${state.name}(${state.isoCode})` : state.name;
  };

  // Fetch state by name if editing (when value prop changes)
  useEffect(() => {
    const fetchStateByName = async () => {
      if (!value) {
        setSelectedOption(null);
        setInputValue("");
        return;
      }

      // Parse the value to get just the name part
      const stateName = parseStateValue(value);

      // Check if the state is already in options
      const existingOption = options.find((opt) => opt.name === stateName);
      if (existingOption) {
        setSelectedOption(existingOption);
        setInputValue(formatStateValue(existingOption));
        return;
      }

      // Set inputValue immediately so it shows in the field while fetching
      setInputValue(value);

      setLoading(true);
      try {
        const response = await useGql({
          query: GET_STATES,
          queryName: "states",
          queryType: "query",
          variables: {
            filter: {
              name: { eq: stateName },
            },
          },
        });

        if (response && response.length > 0) {
          const stateOption = response[0];
          setOptions((prevOptions) => {
            // Avoid duplicates
            if (prevOptions.some((opt) => opt.id === stateOption.id)) {
              return prevOptions;
            }
            return [...prevOptions, stateOption];
          });
          setSelectedOption(stateOption);
          setInputValue(formatStateValue(stateOption));
        } else {
          // If not found but value exists, show the original value
          setInputValue(value);
        }
      } catch (error) {
        console.error("Error fetching state by name:", error);
        // Value is already set above, so it will still show
      } finally {
        setLoading(false);
      }
    };

    fetchStateByName();
  }, [value]);

  // Fetch states dynamically based on inputValue (for search)
  useEffect(() => {
    const fetchStates = async () => {
      // Don't fetch if inputValue matches the current selected option
      const formattedSelected = selectedOption
        ? formatStateValue(selectedOption)
        : "";
      if (!inputValue || inputValue === formattedSelected) return;

      // Parse inputValue to get just the name part for searching
      const searchName = parseStateValue(inputValue);

      setLoading(true);

      try {
        const response = await useGql({
          query: GET_STATES,
          queryName: "states",
          queryType: "query",
          variables: {
            filter: {
              name: { iLike: searchName },
            },
          },
        });

        setOptions(response || []);
      } catch (error) {
        console.error("Error fetching states:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchStates, 300); // Debounce API calls

    return () => clearTimeout(debounce);
  }, [inputValue, selectedOption]);

  return (
    <Autocomplete
      getOptionLabel={(option) => formatStateValue(option)}
      options={options}
      value={selectedOption}
      inputValue={inputValue}
      loading={loading}
      onInputChange={(event, newValue) => {
        setInputValue(newValue);
        // Clear selectedOption if user is typing something different
        const formattedSelected = selectedOption
          ? formatStateValue(selectedOption)
          : "";
        if (newValue !== formattedSelected) {
          setSelectedOption(null);
        }
      }}
      onChange={(_, selectedOption) => {
        setSelectedOption(selectedOption);
        // Store as "Name(ISO)" format
        const formattedValue = selectedOption
          ? formatStateValue(selectedOption)
          : "";
        onChange(formattedValue);
        setInputValue(formattedValue);
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
          <span style={{ fontWeight: "bold" }}>{formatStateValue(option)}</span>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          size="small"
          variant="outlined"
          error={error} // Pass the error prop here
          helperText={helperText} // Pass the helperText prop here
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            minHeight: "50px",
            "& .MuiInputBase-root": { minHeight: "50px" },
          }}
        />
      )}
    />
  );
};

export default StateAutocomplete;
