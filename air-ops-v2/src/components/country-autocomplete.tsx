import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";

import useGql from "../lib/graphql/gql";
import { GET_COUNTRIES } from "../lib/graphql/queries/country";

export type ICountry = {
  id: string;
  name: string;
  isoCode: string;
  currency?: string;
  flagUrl?: string;
  emoji?: string;
  timezone?: string;
  dialCode?: string;
  latitude?: number;
  longitude?: number;
};

const CountryAutocomplete = ({
  value,
  onChange,
  label,
  error = null,
  helperText = null,
}: any) => {
  const [inputValue, setInputValue] = useState(""); // Stores user input
  const [options, setOptions] = useState<ICountry[]>([]); // Stores fetched country options
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [selectedOption, setSelectedOption] = useState<ICountry | null>(null); // Track selected option

  // Fetch country by name if editing (when value prop changes)
  useEffect(() => {
    const fetchCountryByName = async () => {
      // If no value, clear selection
      if (!value) {
        setSelectedOption(null);
        setInputValue("");
        return;
      }

      // If we already have a selected option that matches the value, do nothing
      if (selectedOption && selectedOption.name === value) {
        return;
      }

      // Set inputValue immediately so it shows in the field while fetching
      setInputValue(value);

      // Normalize the value for case-insensitive matching
      const normalizedValue = value.toLowerCase();

      // Check if the country is already in options (case-insensitive)
      const existingOption = options.find(
        (opt) => opt.name.toLowerCase() === normalizedValue
      );
      if (existingOption) {
        setSelectedOption(existingOption);
        return;
      }

      // Prepare search value (Pascal Case)
      const searchValue = value
        .split(" ")
        .map(
          (word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      setLoading(true);
      try {
        // Try exact match first
        let response = await useGql({
          query: GET_COUNTRIES,
          queryName: "countries",
          queryType: "query",
          variables: {
            filter: {
              name: { eq: searchValue },
            },
          },
        });

        // If not found, try case-insensitive search
        if (!response || response.length === 0) {
          response = await useGql({
            query: GET_COUNTRIES,
            queryName: "countries",
            queryType: "query",
            variables: {
              filter: {
                name: { iLike: `%${normalizedValue}%` },
              },
            },
          });
        }

        if (response && response.length > 0) {
          const countryOption = response[0];
          setOptions((prevOptions) => {
            // Avoid duplicates
            if (prevOptions.some((opt) => opt.id === countryOption.id)) {
              return prevOptions;
            }
            return [...prevOptions, countryOption];
          });
          setSelectedOption(countryOption);
        }
      } catch (error) {
        console.error("Error fetching country by name:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryByName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Fetch countries dynamically based on inputValue (for search)
  useEffect(() => {
    const fetchCountries = async () => {
      if (!inputValue) return;

      // Strip emoji from inputValue for comparison and search
      // Remove emoji pattern (might have space after emoji)
      const searchText = inputValue
        .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
        .trim();

      // Don't fetch if inputValue matches the current selected option
      const formattedSelected = selectedOption ? selectedOption.name : "";
      if (inputValue === formattedSelected || !searchText) return;

      setLoading(true);

      try {
        const response = await useGql({
          query: GET_COUNTRIES,
          queryName: "countries",
          queryType: "query",
          variables: {
            filter: {
              name: { iLike: `%${searchText}%` },
            },
          },
        });

        setOptions(response || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCountries, 300); // Debounce API calls

    return () => clearTimeout(debounce);
  }, [inputValue, selectedOption]);

  return (
    <Autocomplete
      filterOptions={(x) => x}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      options={options}
      value={selectedOption}
      inputValue={inputValue}
      loading={loading}
      onInputChange={(event, newValue) => {
        setInputValue(newValue);
        // Clear selectedOption if user is typing something different
        // Compare with just the name (value stored)
        const formattedSelected = selectedOption ? selectedOption.name : "";
        if (newValue !== formattedSelected) {
          setSelectedOption(null);
        }
      }}
      onChange={(_, selectedOption) => {
        setSelectedOption(selectedOption);
        // Store and display just the country name
        onChange(selectedOption ? selectedOption.name : "");
        setInputValue(selectedOption ? selectedOption.name : "");
      }}
      renderOption={(props, option) => (
        <li
          {...props}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {option.emoji && (
              <span style={{ fontSize: "1.2rem" }}>{option.emoji}</span>
            )}
            <span style={{ fontWeight: "bold" }}>{option.name}</span>
            {option.isoCode && (
              <span style={{ fontSize: "0.875rem", color: "#666" }}>
                {option.isoCode}
              </span>
            )}
          </div>
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

export default CountryAutocomplete;
