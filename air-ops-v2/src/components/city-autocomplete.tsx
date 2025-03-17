
import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, Autocomplete } from "@mui/material";
import { GET_AIRPORTS } from "../lib/graphql/queries/airports";
import useGql from "../lib/graphql/gql";
import { GET_CITIES } from "../lib/graphql/queries/city";

const CityAutocomplete = ({ value, onChange, label }: any) => {
  const [inputValue, setInputValue] = useState(""); // Stores user input
  const [options, setOptions] = useState<ICity[]>([]); // Stores fetched airport options
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [selectedOption, setSelectedOption] = useState<ICity | null>(null); // Track selected option

  // Fetch airports dynamically based on inputValue
  useEffect(() => {
    const fetchCities = async () => {
      if (!inputValue) return;
      setLoading(true);

      try {
        const response = await useGql({
          query: GET_CITIES,
          queryName: "cities",
          queryType: "query",
          variables: {
            filter: {
                name: { iLike: inputValue }
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

    const debounce = setTimeout(fetchCities, 300); // Debounce API calls

    return () => clearTimeout(debounce);
  }, [inputValue]);

  // Fetch airport by code if editing
  useEffect(() => {
    const fetchAirportByCode = async () => {
      if (!value || options.some((opt) => opt.name === value)) return;

      setLoading(true);
      try {
        const response = await useGql({
          query: GET_CITIES,
          queryName: "cities",
          queryType: "query",
          variables: {
            filter: {
              name: { eq: value },
            },
          },
        });

        if (response.length > 0) {
          setOptions((prevOptions) => [...prevOptions, response[0]]);
          setSelectedOption(response[0]);
          setInputValue(response[0].name);
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
     
      getOptionLabel={(option) => option.name}
      options={options}
      value={selectedOption}
      onInputChange={(event, newValue) => {
        setInputValue(newValue);
      }}
      onChange={(_, selectedOption) => {
        setSelectedOption(selectedOption);
        onChange(selectedOption ? selectedOption.name : "");
        setInputValue(selectedOption ? selectedOption.name : "");
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
          <span style={{ fontWeight: "bold" }}>{option.name}</span>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          size="small"
          variant="outlined"
          sx={{
            minHeight: "50px",
            "& .MuiInputBase-root": { minHeight: "50px" },
          }}
        />
      )}
    />
  );
};

export default CityAutocomplete;
