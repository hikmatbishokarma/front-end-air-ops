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
      if (!value) {
        setSelectedOption(null);
        setInputValue("");
        return;
      }

      // Set inputValue immediately so it shows in the field while fetching
      setInputValue(value);

      // Normalize the value for case-insensitive matching (airports might have CAPS, country collection has Pascal Case)
      const normalizedValue = value.toLowerCase();

      // Check if the country is already in options (case-insensitive)
      const existingOption = options.find(
        (opt) => opt.name.toLowerCase() === normalizedValue
      );
      if (existingOption) {
        setSelectedOption(existingOption);
        // Display just the name in input field
        setInputValue(existingOption.name);
        return;
      }

      // Convert CAPS to Pascal Case for search (in case value is in CAPS)
      // Convert "UNITED STATES" -> "United States" for better matching
      const searchValue = value
        .split(" ")
        .map(
          (word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      setLoading(true);
      try {
        // Try exact match first with the converted value
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
          // Display just the name in input field
          setInputValue(countryOption.name);
        } else {
          // If not found but value exists, show the original value
          setInputValue(value);
        }
      } catch (error) {
        console.error("Error fetching country by name:", error);
        // Value is already set above, so it will still show
      } finally {
        setLoading(false);
      }
    };

    fetchCountryByName();
  }, [value, options]);

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
      getOptionLabel={(option) => {
        // For dropdown: Emoji Name Code format (code last)
        if (option.emoji && option.isoCode) {
          return `${option.emoji} ${option.name} ${option.isoCode}`;
        } else if (option.emoji) {
          return `${option.emoji} ${option.name}`;
        } else if (option.isoCode) {
          return `${option.name} ${option.isoCode}`;
        }
        return option.name;
      }}
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
