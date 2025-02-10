import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { TextField, Button, Box, IconButton, Grid, Typography, Autocomplete } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import useGql from "../../lib/graphql/gql";
import { GET_AIRCRAFT } from "../../lib/graphql/queries/aircraft";
import { CREATE_PRICE } from "../../lib/graphql/queries/price";

type Price = {
  label: string;
  unit: string;
  price: number;
  currency: string;
  total: number;
  margin: number;
};

type FormValues = {
    aircraft:string
    prices: Price[]
  grandTotal:number
};

interface AircraftCategory {
    id: string;
    name: string;
  }

interface Aircraft {
    id: string;
    name: string;
    category: AircraftCategory;
  }
  

const PriceCreate: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
        aircraft:"",
        prices: [
        { label: "Discount", unit: "", price: 0, currency: "INR", total: 0, margin: 0 }, // Default empty row
      ],
      grandTotal:0
    },
  });
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
  });

  // Auto-calculate total when price or margin changes
  React.useEffect(() => {
    const prices = watch("prices");
    prices.forEach((item, index) => {
      if (item.price && item.margin !== undefined) {
        setValue(
          `prices.${index}.total`,
          item.price + (item.price * item.margin) / 100,
        );
      }
    });
  }, [watch("prices"), setValue]);


  const createPrice = async (formData) => {
    const data = await useGql({
      query: CREATE_PRICE,
      queryName: "price",
      variables: {
        input: {
            price: formData,
        },
      },
    });
  };

  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data);

    const formattedData = {
        ...data,
        prices: data.prices.map((item) => ({
          ...item,
          price: Number(item.price), 
          total: Number(item.total),  
          margin: Number(item.margin), 
        }))
    }

    createPrice(formattedData)

  };


const handleAddFee = (selectedFee) => {

    console.log("selectedFee",selectedFee)
    if (!selectedFee) return;
  
  
    append({
      label: selectedFee.label,
      unit: '0',
      price: 0,
      currency: "INR",
      margin:0,
      total: 0, // Calculate total
    });
  };

  const getAircrafts = async (categoryId) => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT,
        queryName: "aircraft",
        queryType: "query",
        variables: categoryId
          ? {
              sorting: [
                {
                  field: "category",
                  direction: "ASC",
                },
              ],
            }
          : {},
      });
      setAircrafts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

    useEffect(() => {

      getAircrafts(null);

    }, []);

    const newFeeOption=[
        { label: 'pilot fee', id: 1 },
        { label: 'Pulp Fiction', id: 2 },
    ]

  return (
    
    <Box
  component="form"
  onSubmit={handleSubmit(onSubmit)}
  sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}
  
>
<Grid container spacing={2} alignItems="center"  sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Controller
             name="aircraft"
            control={control}
            
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={aircrafts}
                getOptionLabel={(option) => option.name}
                value={
                    field.value
                      ? aircrafts.find(
                          (aircraft) => aircraft.id === field.value,
                        )
                      : null
                  }
                  onChange={(_, value) => {
                    field.onChange(value ? value.id : "");
                  }}
               renderInput={(params) => (
                                        <TextField {...params} size="small" />
                                      )}
              />
            )}
          />
        </Grid>
      </Grid>
  {fields.map((field, index) => (
    <>
   
    
    <Grid container key={field.id} spacing={2} sx={{ mb: 3 }} alignItems="center">
      {/* Label (Wider) */}
      <Grid item xs={3}>
        <Controller
          name={`prices.${index}.label`}
          control={control}
          rules={{ required: "Label is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Label"
              fullWidth
              size="small"
              error={!!errors.prices?.[index]?.label}
              helperText={errors.prices?.[index]?.label?.message}
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
          render={({ field }) => (
            <TextField
              {...field}
              label="Unit"
              fullWidth
              size="small"
              error={!!errors.prices?.[index]?.unit}
              helperText={errors.prices?.[index]?.unit?.message}
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
            min: { value: 1, message: "Must be > 0" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Price"
              type="number"
              fullWidth
              size="small"
              error={!!errors.prices?.[index]?.price}
              helperText={errors.prices?.[index]?.price?.message}
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
              error={!!errors.prices?.[index]?.currency}
              helperText={errors.prices?.[index]?.currency?.message}
            />
          )}
        />
      </Grid>

      {/* Margin */}
      <Grid item xs={1.5}>
        <Controller
          name={`prices.${index}.margin`}
          control={control}
          rules={{
            required: "Margin is required",
            min: { value: 0, message: "Cannot be negative" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Margin (%)"
              type="number"
              fullWidth
              size="small"
              error={!!errors.prices?.[index]?.margin}
              helperText={errors.prices?.[index]?.margin?.message}
            />
          )}
        />
      </Grid>

      {/* Total (Disabled) */}
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
        <IconButton onClick={() => remove(index)} color="error">
          <Delete fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>

  
 
    </>
  ))}


  {/* Add Row Button */}
  {/* <Box sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
    <IconButton aria-label="Add" onClick={addPriceRow}>
      <AddIcon />
    </IconButton>
  </Box> */}

<Grid container spacing={2} sx={{ mt: 2 }}>
  {/* Autocomplete Dropdown for Adding New Fee */}
  <Grid item xs={5}>
    <Autocomplete
      options={newFeeOption} // Define available fee options
      getOptionLabel={(option) => option.label}
      
     onChange={(event, newValue) => handleAddFee(newValue)}
      renderInput={(params) => <TextField {...params} label="Add New Fee" fullWidth size="small" />}
    />
  </Grid>

  {/* Total Currency Display */}
  <Grid item xs={2}>
   
    <span>TOTAL</span>
  </Grid>
  <Grid item xs={2}>
  
    <span>INR</span>
  </Grid>

  {/* Grand Total Display */}
  <Grid item xs={3}>
   <span>1000</span>
  </Grid>
</Grid>


  {/* Submit Button (Aligned Right) */}
  <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
    <Button type="submit" variant="contained" color="primary">
      Submit
    </Button>
  </Box>
</Box>

  );
};

export default PriceCreate;
