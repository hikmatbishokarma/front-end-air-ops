// components/MultiSelectField.tsx
import React from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";

interface MultiSelectFieldProps<T> {
  value: T[];
  onChange: (value: T[]) => void;
  label: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  error?: boolean;
  helperText?: string;
  size?: "small" | "medium";
}

export default function MultiSelectAutoComplete<T>({
  value,
  onChange,
  label,
  options,
  getOptionLabel,
  isOptionEqualToValue = (a, b) => a === b,
  error,
  helperText,
  size = "small",
}: MultiSelectFieldProps<T>) {
  return (
    <Autocomplete
      multiple
      options={options}
      disableCloseOnSelect
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox style={{ marginRight: 8 }} checked={selected} />
          {getOptionLabel(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          size={size}
        />
      )}
    />
  );
}
