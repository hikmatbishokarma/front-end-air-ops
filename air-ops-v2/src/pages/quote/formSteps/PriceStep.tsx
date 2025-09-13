// src/quotes/formSteps/PriceStep.tsx
import React, { useState, useEffect } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { Grid, Box, Typography, TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { calculateTotalFlightTime } from "../../../lib/utils";

const PriceStep = ({ control, watch, setValue, getValues, itinerary }) => {
  const {
    fields: priceFields,
    append: appendPrice,
    remove: removePrice,
  } = useFieldArray({
    control,
    name: "prices",
  });
  const watchedPrices = watch("prices");
  // const [grandTotal, setGrandTotal] = useState(0);

  const prices = useWatch({ control, name: "prices" });

  const grandTotal = useWatch({ control, name: "grandTotal" }) || 0;

  useEffect(() => {
    let grandTotal =
      prices?.reduce((sum, item) => sum + (Number(item.total) || 0), 0) || 0;

    grandTotal = Math.round(grandTotal * 100) / 100;

    setValue("grandTotal", grandTotal, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [prices, setValue]);

  // This is where you should keep the total flight time calculation
  useEffect(() => {
    if (!itinerary || !itinerary.length) return;

    const totalTime = calculateTotalFlightTime(itinerary);

    const prices = [...getValues("prices")];

    // Ensure the first item is 'Charter Charges' and update it
    if (prices.length > 0 && prices[0].label === "Charter Charges") {
      // const decimalHours =
      //   parseInt(totalTime.split(":")[0]) +
      //   parseInt(totalTime.split(":")[1]) / 60;
      // const total = decimalHours * (Number(prices[0].price) || 0);
      // const roundedTotal = Math.round(total * 100) / 100;

      // // Use setValue to update the form state
      // setValue(`prices.0.unit`, totalTime, { shouldDirty: true });
      // setValue(`prices.0.total`, roundedTotal, { shouldDirty: true });

      prices[0].unit = totalTime;

      const decimalHours =
        parseInt(totalTime.split(":")[0]) +
        parseInt(totalTime.split(":")[1]) / 60;
      prices[0].total = decimalHours * (Number(prices[0].price) || 0);

      setValue("prices", prices, { shouldDirty: true });
    }
  }, [JSON.stringify(itinerary), getValues, setValue]);

  // Calculate the grand total whenever the prices array changes
  // useEffect(() => {
  //   if (watchedPrices) {
  //     const newGrandTotal = watchedPrices.reduce((sum, item) => {
  //       const total = getValues(`prices.${watchedPrices.indexOf(item)}.total`);
  //       return sum + (total || 0);
  //     }, 0);
  //     setGrandTotal(newGrandTotal);
  //   }
  // }, [watchedPrices, getValues, setGrandTotal]);

  const handleAddFee = () => {
    appendPrice({
      label: "",
      unit: "01:00",
      price: 0,
      currency: "INR",
      total: 0,
    });
  };

  const handleUnitChange = (newValue, index) => {
    const formatted = newValue ? moment(newValue).format("HH:mm") : "";
    setValue(`prices.${index}.unit`, formatted);

    if (formatted) {
      const [hh, mm] = formatted.split(":").map(Number);
      const decimalHours = hh + mm / 60;

      const priceValue = getValues(`prices.${index}.price`);
      if (priceValue) {
        const total = decimalHours * priceValue;
        const roundedTotal = Math.round(total * 100) / 100;
        setValue(`prices.${index}.total`, roundedTotal);
      }
    } else {
      setValue(`prices.${index}.total`, 0);
    }
  };

  const handlePriceChange = (e, index, fieldOnChange) => {
    const value = e.target.value;
    if (/^[0-9]*(\.[0-9]+)?$/.test(value) || value === "") {
      fieldOnChange(value ? Number(value) : "");

      const unitString = getValues(`prices.${index}.unit`);
      const match = unitString?.match(/^(\d{1,2}):([0-5][0-9])$/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const decimalHours = hours + minutes / 60;

        const total = decimalHours * Number(value);
        const roundedTotal = Math.round(total * 100) / 100;
        setValue(`prices.${index}.total`, roundedTotal);
      }
    }
  };

  return (
    <Box sx={{ mt: 5 }} className="price-units">
      <Grid container spacing={2} sx={{ mb: 3 }} className="label-price-c1">
        <Grid item xs={3}>
          <Typography variant="h6">Label</Typography>
        </Grid>
        <Grid item xs={1.5}>
          <Typography variant="h6">Unit (Hrs)</Typography>
        </Grid>
        <Grid item xs={1.5}>
          <Typography variant="h6">Price</Typography>
        </Grid>
        <Grid item xs={1.5}>
          <Typography variant="h6">Currency</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">Total</Typography>
        </Grid>
      </Grid>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {priceFields.map((field, index) => (
          <Grid
            container
            key={field.id}
            spacing={2}
            sx={{ mb: 3 }}
            alignItems="center"
          >
            {/* Label */}
            <Grid item xs={3}>
              <Controller
                name={`prices.${index}.label`}
                control={control}
                rules={{ required: "Label is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Label"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            {/* Unit */}
            <Grid item xs={1.5}>
              <Controller
                name={`prices.${index}.unit`}
                control={control}
                rules={{ required: "Unit is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TimeField
                    {...field}
                    value={field.value ? moment(field.value, "HH:mm") : null}
                    onChange={(newValue) => handleUnitChange(newValue, index)}
                    disabled={true}
                    label="Unit (HH:mm)"
                    size="small"
                    format="HH:mm"
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        size: "small",
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={1.5}>
              <Controller
                name={`prices.${index}.price`}
                control={control}
                rules={{
                  required: "Price is required",
                  min: { value: 0, message: "Must be >= 0" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Price"
                    fullWidth
                    size="small"
                    onChange={(e) =>
                      handlePriceChange(e, index, field.onChange)
                    }
                    required
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            {/* Currency */}
            <Grid item xs={1.5}>
              <Controller
                name={`prices.${index}.currency`}
                control={control}
                rules={{ required: "Currency is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Currency"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Total */}
            <Grid item xs={2}>
              <Controller
                name={`prices.${index}.total`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total"
                    type="number"
                    fullWidth
                    size="small"
                    disabled
                  />
                )}
              />
            </Grid>

            {/* Delete Button */}
            <Grid item xs={1}>
              <IconButton
                className="add-icon-v1"
                onClick={() => removePrice(index)}
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </LocalizationProvider>

      {/* Add Button */}
      <Grid item xs={1.5}>
        <IconButton
          aria-label="Add"
          onClick={handleAddFee}
          className="add-icon-v1"
        >
          <AddIcon />
        </IconButton>
      </Grid>

      {/* Grand Total */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={1.5}>
          <span>TOTAL</span>
        </Grid>
        <Grid item xs={1.5} className="inr-width">
          <span>INR</span>
        </Grid>
        <Grid item xs={2}>
          <TextField
            value={grandTotal}
            type="number"
            fullWidth
            size="small"
            disabled
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PriceStep;
