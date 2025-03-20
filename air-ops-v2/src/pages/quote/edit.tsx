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
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  LocalizationProvider,
  DateTimePicker,
  DatePicker,
  TimeField,
} from "@mui/x-date-pickers";

import moment from "moment";
import useGql from "../../lib/graphql/gql";
import { GET_QUOTE_BY_ID, UPDATE_QUOTE } from "../../lib/graphql/queries/quote";

import AddIcon from "@mui/icons-material/Add";

import AirportsAutocomplete from "../../components/airport-autocommplete";

import { useQuoteData } from "../../hooks/useQuoteData";
import { IaircraftCategory, Iclient } from "../../interfaces/quote.interface";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

const QuoteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, watch, register } = useForm();
  const {
    aircraftCategories,
    aircrafts,
    representatives,
    clients,
    fetchAircrafts,
    fetchRepresentatives,
  } = useQuoteData();
  const [selectedAircraftCategory, setSelectedAircraftCategory] =
    useState<IaircraftCategory | null>(null);

    const [selectedClient, setSelectedClient] = useState<Iclient | null>();

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "itinerary",
  });

  const {
    fields: priceFields,
    append: appendPrice,
    remove: removePrice,
  } = useFieldArray({
    control,
    name: "prices",
  });

  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]);

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
      setValue("representative", response.representative.id);
      setSelectedClient(response.requestedBy.id)
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAircrafts(selectedAircraftCategory || null);
    fetchRepresentatives(null);
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
    const grandTotal =
      prices?.reduce((sum, item) => sum + (Number(item.total) || 0), 0) || 0;
    console.log("grandTotal", grandTotal);

    setValue("grandTotal", grandTotal, {
      shouldValidate: true,
      shouldDirty: true,
    });
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


  const addItinerary = () => {
    const lastItinerary = watch("itinerary", []); // Get the current itinerary list
    const prevDestination =
      lastItinerary.length > 0
        ? lastItinerary[lastItinerary.length - 1]?.destination
        : "";

    const newIndex = lastItinerary.length; // Get the index for the new itinerary

    appendItinerary({
      source: prevDestination, // Auto-fill source from the last destination
      destination: "",
      depatureDate: "",
      depatureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      paxNumber: 1,
    });

    // Use setValue to force update the new itinerary field
    setTimeout(() => {
      setValue(`itinerary.${newIndex}.source`, prevDestination);
    }, 0); // Delay to ensure the new field is registered
  };

 

    const steps = ["General Information", "Itinerary Details", "Price"];
  
    const [activeStep, setActiveStep] = useState(0);
  
    const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  

  if (loading) return <p>Loading...</p>;

  return (
   <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Quote
      </Typography>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
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

        
          <Grid item xs={4}>
            <Typography>Representative:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="representative"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={representatives}
                  getOptionLabel={(option) => option.name}
                  value={
                    field.value
                      ? representatives.find(
                          (representative) => representative.id === field.value,
                        )
                      : null
                  }
                  onChange={(_, newValue) => {
                    field.onChange(newValue ? newValue.id : ""); // Update only the selected value
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              )}
            />
          </Grid>

        
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
                    <AirportsAutocomplete {...field} label="Source (ADEP)" />
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
                        }} 
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
                        value={
                          field.value ? moment(field.value, "HH:mm") : null
                        } 
                        onChange={(newValue) =>
                          field.onChange(
                            newValue ? moment(newValue).format("HH:mm") : "",
                          )
                        }
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
                        }} 
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
                        value={
                          field.value ? moment(field.value, "HH:mm") : null
                        } 
                        onChange={(newValue) =>
                          field.onChange(
                            newValue ? moment(newValue).format("HH:mm") : "",
                          )
                        }
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
                <IconButton
                  onClick={() => removeItinerary(index)}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            onClick={() => appendItinerary({})}
            variant="contained"
            sx={{ mt: 2 }}
          >
            <AddIcon fontSize="small" />
          </Button>
        </Box>

        <Box sx={{ mt: 5 }}>
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
                        onChange={(e) =>
                          handlePriceChange(index, "unit", e.target.value)
                        }
                      />
                    )}
                  />
                </Grid>

           
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
                       
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : "";
                          field.onChange(value);
                          handlePriceChange(index, "price", value);
                        }}
                      />
                    )}
                  />
                </Grid>

              
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

              
                <Grid item xs={1}>
                  <IconButton onClick={() => removePrice(index)} color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </>
          ))}

          <Button
            onClick={() => appendPrice({})}
            variant="contained"
            sx={{ mt: 2 }}
          >
            <AddIcon fontSize="small" />
          </Button>

          <Grid container spacing={2} sx={{ mt: 2 }}>
          
            <Grid item xs={1.5}>
              <span>TOTAL</span>
            </Grid>
            <Grid item xs={1.5}>
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

        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
        >
          Save
        </Button>
      </form> */}
      <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="form_Work"
              style={{ padding: "20px", flex: 0.5 }}
            >
              {activeStep === 0 && (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography sx={{ whiteSpace: "nowrap" }}>
                      Requested by:
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name="requestedBy"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={clients}
                          getOptionLabel={(option) => option.name}
                          value={
                            field.value
                              ? clients.find(
                                  (client) => client.id === field.value,
                                )
                              : null
                          }
                          onChange={(_, newValue) => {
                            setSelectedClient(newValue);
                            field.onChange(newValue ? newValue.id : ""); // Update only the selected value
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label="Requested By"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      // onClick={() => setSubDialogOpen(true)}
                    >
                      Edit Client
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ whiteSpace: "nowrap" }}>
                      Representative:
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Controller
                      name="representative"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={representatives}
                          getOptionLabel={(option) => option.name}
                          value={
                            field.value
                              ? representatives.find(
                                  (representative) =>
                                    representative.id === field.value,
                                )
                              : null
                          }
                          onChange={(_, newValue) => {
                            field.onChange(newValue ? newValue.id : ""); // Update only the selected value
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label="Representative"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {" "}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      // onClick={() => setRepresentativeDialogOpen(true)}
                    >
                      Edit Rep
                    </Button>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography sx={{ whiteSpace: "nowrap" }}>
                      Category:
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
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
                            <TextField {...params} fullWidth label="Category" />
                          )}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography sx={{ whiteSpace: "nowrap" }}>
                      Aircraft:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="aircraft"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={aircrafts}
                          getOptionLabel={(option) => option.code}
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
                            <TextField {...params} fullWidth label="Aircraft" />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Box sx={{ display: "flex", mt: 5 }}>
                  {/* Left Section - Itinerary Form */}
                  <Box sx={{ flex: 0.4, pr: 2 }}>
                    {itineraryFields.map((item, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={item.id}
                        alignItems="center"
                        sx={{ mt: 2, borderBottom: "1px solid #ddd", pb: 2 }}
                      >
                        {/* Source and Destination in one line */}
                        <Grid item xs={6}>
                          <Controller
                            name={`itinerary.${index}.source`}
                            control={control}
                            render={({ field }) => (
                              <AirportsAutocomplete {...field} label="Source" />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Controller
                            name={`itinerary.${index}.destination`}
                            control={control}
                            render={({ field }) => (
                              <AirportsAutocomplete
                                {...field}
                                label="Destination"
                              />
                            )}
                          />
                        </Grid>

                        {/* Departure Date and Time in one line */}
                        <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Controller
                              name={`itinerary.${index}.depatureDate`}
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  format="DD-MM-YYYY"
                                  value={
                                    field.value ? moment(field.value) : null
                                  }
                                  onChange={(newValue) =>
                                    field.onChange(newValue)
                                  }
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      size: "small",
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Controller
                              name={`itinerary.${index}.depatureTime`}
                              control={control}
                              render={({ field }) => (
                                <TimeField
                                  {...field}
                                  value={
                                    field.value
                                      ? moment(field.value, "HH:mm")
                                      : null
                                  }
                                  onChange={(newValue) =>
                                    field.onChange(
                                      newValue
                                        ? moment(newValue).format("HH:mm")
                                        : "",
                                    )
                                  }
                                  label="Departure Time"
                                  size="small"
                                  format="HH:mm"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>

                        {/* Arrival Date and Time in one line */}
                        <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Controller
                              name={`itinerary.${index}.arrivalDate`}
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  format="DD-MM-YYYY"
                                  value={
                                    field.value ? moment(field.value) : null
                                  }
                                  onChange={(newValue) =>
                                    field.onChange(newValue)
                                  }
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      size: "small",
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Controller
                              name={`itinerary.${index}.arrivalTime`}
                              control={control}
                              render={({ field }) => (
                                <TimeField
                                  {...field}
                                  value={
                                    field.value
                                      ? moment(field.value, "HH:mm")
                                      : null
                                  }
                                  onChange={(newValue) =>
                                    field.onChange(
                                      newValue
                                        ? moment(newValue).format("HH:mm")
                                        : "",
                                    )
                                  }
                                  label="Arrival Time"
                                  size="small"
                                  format="HH:mm"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>

                        {/* PAX Number */}
                        <Grid item xs={6}>
                          <Controller
                            name={`itinerary.${index}.paxNumber`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                fullWidth
                                size="small"
                                label="PAX"
                              />
                            )}
                          />
                        </Grid>

                        {/* Remove Itinerary Button */}
                        <Grid
                          item
                          xs={6}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          {/* <IconButton onClick={() => removeItinerary(index)} color="error">
            <Delete fontSize="small" />
          </IconButton> */}
                          <Button
                            variant="outlined"
                            startIcon={<Delete />}
                            onClick={() => removeItinerary(index)}
                            color="error"
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addItinerary}
                    >
                      Add Itinerary
                    </Button>
                  </Box>

                  {/* Right Section - Calendar */}
                  <Box
                    sx={{
                      flex: 0.6,
                      backgroundColor: "#fff",
                      borderLeft: "1px solid grey",
                      paddingLeft: "8px",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Calendar
                    </Typography>

                    <FullCalendar
                      plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                      initialView="dayGridMonth"
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                      }}
                      events={events}
                    />
                  </Box>
                </Box>
              )}
              {activeStep === 2 && (
                <Box sx={{ mt: 5 }}>
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
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    "unit",
                                    e.target.value,
                                  )
                                }
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
                                  const value = e.target.value
                                    ? Number(e.target.value)
                                    : "";
                                  field.onChange(value); // ✅ Convert value to number before updating the form
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
                          <IconButton
                            onClick={() => removePrice(index)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </>
                  ))}
                  <Grid item xs={1.5}>
                    <IconButton aria-label="Add" onClick={handleAddFee}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
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
              )}

              <Box
                sx={{ display: "flex", justifyContent: "space-between", p: 3 }}
              >
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button type="submit" variant="contained" color="success">
                      Submit
                    </Button>
                  </Box>
                ) : (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </form>
          </Box>

          </>
  );
};

export default QuoteEdit;
