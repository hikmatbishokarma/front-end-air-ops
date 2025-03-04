import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, DateTimePicker, DatePicker, TimeField } from "@mui/x-date-pickers";

import moment from "moment";
import useGql from "../../lib/graphql/gql";
import { GET_QUOTE_BY_ID, UPDATE_QUOTE } from "../../lib/graphql/queries/quote";
import { GET_CLIENTS } from "../../lib/graphql/queries/clients";
import { GET_AIRCRAFT } from "../../lib/graphql/queries/aircraft";
import { GET_AIRCRAFT_CATEGORIES } from "../../lib/graphql/queries/aircraft-categories";
import AddIcon from "@mui/icons-material/Add";
import PriceEdit from "../price/edit";
import AirportsAutocomplete from "../../components/airport-autocommplete";

interface AircraftCategory {
  id: string;
  name: string;
}

interface Aircraft {
  id: string;
  name: string;
  category: AircraftCategory;
}

const QuoteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, setValue,watch, register } = useForm();
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "itinerary",
  // });

    const { fields: itineraryFields, append: appendItinerary,remove: removeItinerary } = useFieldArray({
      control,
      name: "itinerary",
    });

      const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
        control,
        name: "prices",
      });

  const [loading, setLoading] = useState(true);
  const [aircraftCategories, setAircraftCategories] = useState<
    AircraftCategory[]
  >([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [selectedAircraftCategory, setSelectedAircraftCategory] =
    useState<AircraftCategory | null>(null);

  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]);
  const [clients, setClients] = useState<any[]>([]);

  // Fetch existing quote details

  const fetchQuote = async () => {
    const response = await useGql({
      query: GET_QUOTE_BY_ID,
      queryName: "quote",
      queryType: "query-without-edge",
      variables: { id },
    });

    console.log("response", response);
    if (response) {
      setValue("referenceNo", response.referenceNo);
      setValue("status", response.status);
      setValue("requestedBy", response.requestedBy.id);
      setValue("representative", response.representative);
      setSelectedAircraftCategory(response.category);
      setValue("category", response.category.id);
      setValue("aircraft", response.aircraft.id);
      setValue("itinerary", response.itinerary);
      setValue("prices", response.prices);
      setValue("grandTotal", response.grandTotal);
    }

    setLoading(false);
  };
  const getAircraftCategories = async () => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT_CATEGORIES,
        queryName: "aircraftCategories",
        queryType: "query",
        variables: {},
      });
      setAircraftCategories(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  const getClients = async () => {
    try {
      const data = await useGql({
        query: GET_CLIENTS,
        queryName: "clients",
        queryType: "query",
        variables: {},
      });
      setClients(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getClients();
    getAircraftCategories();
    getAircrafts(null);

    fetchQuote();
  }, [id, setValue]);

  // Submit updated data
  const onSubmit = async (data) => {
    await useGql({
      query: UPDATE_QUOTE,
      queryName: "updateQuote",
      variables: { id, input: data },
    });
    navigate("/quotes");
  };

    const handlePriceChange = (index, field, value) => {
      const prices = watch("prices");
    
      prices[index][field] = value;
    
      // Calculate total for this row
      const unit = Number(prices[index].unit) || 1;
      const price = Number(prices[index].price) || 0;
    
      prices[index].total = unit * price;
    
      setValue("prices", [...prices]); // Update form state
    };
  
    const prices = useWatch({ control, name: "prices" });
  
    const grandTotal = useWatch({ control, name: "grandTotal" }) || 0;
  
  
    useEffect(() => {
      const grandTotal = prices?.reduce((sum, item) => sum + (Number(item.total) || 0), 0) || 0;
      console.log("grandTotal", grandTotal);
      
      setValue("grandTotal", grandTotal, { shouldValidate: true, shouldDirty: true });
    }, [prices, setValue]);
    
  
    const handleAddFee = (selectedFee) => {
      console.log("selectedFee", selectedFee);
      if (!selectedFee) return;
  
      appendPrice({
        label: selectedFee.label,
        unit: "0",
        price: 0,
        currency: "INR",
        margin: 0,
        total: 0, // Calculate total
      });
    };
    
      
  const newFeeOption = [
    { label: "pilot fee", id: 1 },
    { label: "Pulp Fiction", id: 2 },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Quote
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <Typography sx={{ whiteSpace: "nowrap" }}>Requested by:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="requestedBy"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  value={
                    clients.find((client) => client.id === field.value) || null
                  }
                  onChange={(_, newValue) => field.onChange(newValue?.id || "")}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              )}
            />
          </Grid>

          {/* Representative */}
          <Grid item xs={4}>
            <Typography>Representative:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="representative"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size="small" />
              )}
            />
          </Grid>

          {/* Aircraft Category */}
          <Grid item xs={4}>
            <Typography>Aircraft Category:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={aircraftCategories}
                  getOptionLabel={(option: any) => option?.name}
                  value={selectedAircraftCategory}
                  onChange={(_, newValue) => {
                    setSelectedAircraftCategory(newValue);
                    field.onChange(newValue?.id || "");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              )}
            />
          </Grid>

          {/* Aircraft */}
          <Grid item xs={4}>
            <Typography>Aircraft:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="aircraft"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={aircrafts}
                  getOptionLabel={(option) => option.name}
                  value={
                    aircrafts.find((aircraft) => aircraft.id === field.value) ||
                    null
                  }
                  onChange={(_, newValue) => field.onChange(newValue?.id || "")}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Itinerary List */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Itinerary
          </Typography>
          {itineraryFields.map((item, index) => (
                  <Grid
                    container
                    spacing={1}
                    key={item.id}
                    alignItems="center"
                    sx={{ mt: 1 }}
                  >
                    <Grid item xs={2}>
                      <Controller
                        name={`itinerary.${index}.source`}
                        control={control}
                        render={({ field }) => (
                          <AirportsAutocomplete
                            {...field}
                            label="Source (ADEP)"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <Controller
                        name={`itinerary.${index}.destination`}
                        control={control}
                        render={({ field }) => (
                          <AirportsAutocomplete
                            {...field}
                            label="Destination (ADES)"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={2.5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Controller
                          name={`itinerary.${index}.depatureDate`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                              format="DD-MM-YYYY"
                              value={field.value ? moment(field.value) : null}
                              onChange={(newValue) => field.onChange(newValue)}
                              slotProps={{
                                textField: { fullWidth: true, size: "small" },
                              }} // ✅ FIXED
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2.5}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                        name={`itinerary.${index}.depatureTime`}
                        control={control}
                        render={({ field }) => (
                          <TimeField
                          {...field}
                          value={field.value ? moment(field.value, "HH:mm") : null}  // Ensure it's a Moment object
                          onChange={(newValue) => field.onChange(newValue ? moment(newValue).format("HH:mm") : "")}
                  
                           label="Depature Time"
                           size="small"
                          format="HH:mm"
                        />
                        )}
                      />
                      </LocalizationProvider>
                    </Grid>
                    

                    <Grid item xs={2.5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Controller
                          name={`itinerary.${index}.arrivalDate`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              {...field}
                                format="DD-MM-YYYY"
                              value={field.value ? moment(field.value) : null}
                              onChange={(newValue) => field.onChange(newValue)}
                              slotProps={{
                                textField: { fullWidth: true, size: "small" },
                              }} // ✅ FIXED
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2.5}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                        name={`itinerary.${index}.arrivalTime`}
                        control={control}
                        render={({ field }) => (
                          <TimeField
                          {...field}
                          value={field.value ? moment(field.value, "HH:mm") : null}  // Ensure it's a Moment object
                          onChange={(newValue) => field.onChange(newValue ? moment(newValue).format("HH:mm") : "")}
                  
                          label="Arrival Time"
                          size="small"
                          format="HH:mm"
                        />
                        )}
                      />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2}>
                      <Controller
                        name={`itinerary.${index}.paxNumber`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={1}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton onClick={() => removeItinerary(index)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}

          <Button onClick={() => appendItinerary({})} variant="contained" sx={{ mt: 2 }}>
            <AddIcon fontSize="small" />
          </Button>
        </Box>

         <Box sx={{mt:5}}>
                           <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={3}>
                                  <h4 style={{ margin: "0px" }}>Label</h4>
                                </Grid>
                                <Grid item xs={1.5}>
                                  <h4 style={{ margin: "0px" }}>Unit</h4>
                                </Grid>
                                <Grid item xs={0.5}>
                                  <h4 style={{ margin: "0px" }}>X</h4>
                                </Grid>
                                <Grid item xs={1.5}>
                                  <h4 style={{ margin: "0px" }}>Price</h4>
                                </Grid>
                                <Grid item xs={1.5}>
                                  <h4 style={{ margin: "0px" }}>Currency</h4>
                                </Grid>
                                <Grid item xs={1.5}>
                                  <h4 style={{ margin: "0px" }}>Margin (%)</h4>
                                </Grid>
                                <Grid item xs={1.5}>
                                  <h4 style={{ margin: "0px" }}>Total</h4>
                                </Grid>
                              </Grid>
                      {priceFields.map((field, index) => (
                <>
                  <Grid
                    container
                    key={field.id}
                    spacing={2}
                    sx={{ mb: 3 }}
                    alignItems="center"
                  >
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
                            onChange={(e) => handlePriceChange(index, "unit", e.target.value)}
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
                            // onChange={(e) => handlePriceChange(index, "price", e.target.value)}
                            onChange={(e) => {
                              const value = e.target.value ? Number(e.target.value) : "";
                              field.onChange(value);  // ✅ Convert value to number before updating the form
                              handlePriceChange(index, "price", value);
                            }}
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
                      <IconButton onClick={() => removePrice(index)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </>
              ))}
        
              <Grid container spacing={2} sx={{ mt: 2 }}>
                      {/* Autocomplete Dropdown for Adding New Fee */}
                      <Grid item xs={4.5}>
                        <Autocomplete
                          options={newFeeOption} // Define available fee options
                          getOptionLabel={(option) => option.label}
                          onChange={(event, newValue) => handleAddFee(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Add New Fee"
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      </Grid>
              
                      {/* Total Currency Display */}
                      <Grid item xs={1.5}>
                        <span>TOTAL</span>
                      </Grid>
                      <Grid item xs={1.5}>
                        <span>INR</span>
                      </Grid>
              
                      {/* Grand Total Display */}
                      <Grid item xs={2}>
                       <TextField
        
            value={grandTotal} // Use `useWatch` value
            type="number"
            fullWidth
            size="small"
            disabled
          />
                      </Grid>
                    </Grid>
              
                      </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
        >
          Save
        </Button>
      </form>
     
    </Paper>
  );
};

export default QuoteEdit;
