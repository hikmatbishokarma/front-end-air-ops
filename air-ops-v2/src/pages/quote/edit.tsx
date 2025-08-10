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
  Container,
  MenuItem,
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
import {
  FLIGHT_SEGMENTS_FOR_CALENDER,
  GET_QUOTE_BY_ID,
  UPDATE_QUOTE,
} from "../../lib/graphql/queries/quote";

import AddIcon from "@mui/icons-material/Add";

import AirportsAutocomplete from "../../components/airport-autocommplete";

import { useQuoteData } from "../../hooks/useQuoteData";
import {
  IaircraftCategory,
  Iclient,
  Irepresentative,
} from "../../interfaces/quote.interface";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import ClientDialog from "../clients/dialog";
import RepresentativeDialog from "../representative/dialog";
import {
  categoryOptions,
  getMinDepartureTime,
  parseUnitToDecimal,
  validateArrivalAfterDeparture,
  validateArrivalTime,
  validateDepartureTime,
} from "./create";
import DeleteIcon from "@mui/icons-material/Delete";
const QuoteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, watch, register, getValues } =
    useForm();
  const {
    // aircraftCategories,
    aircrafts,
    representatives,
    clients,
    fetchAircrafts,
    fetchRepresentatives,
    fetchClients,
  } = useQuoteData();
  // const [selectedAircraftCategory, setSelectedAircraftCategory] =
  //   useState<IaircraftCategory | null>(null);

  const [selectedClient, setSelectedClient] = useState<Iclient | null>();
  const [selectedRepresentative, setSelectedRepresentative] =
    useState<Irepresentative | null>();

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

  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [representativeDialogOpen, setRepresentativeDialogOpen] =
    useState(false);

  // Fetch existing quote details

  const fetchQuote = async () => {
    const response = await useGql({
      query: GET_QUOTE_BY_ID,
      queryName: "quote",
      queryType: "query-without-edge",
      variables: { id },
    });

    if (response) {
      //setValue("referenceNo", response.referenceNo);
      // setValue("status", response.status);
      setValue("requestedBy", response.requestedBy.id);
      setValue("representative", response?.representative?.id);
      // setSelectedAircraftCategory(response.category);
      setValue("category", response.category);
      setValue("aircraft", response.aircraft.id);
      setValue("itinerary", response.itinerary);
      setValue(
        "prices",
        response?.prices?.map(({ __typename, ...rest }) => rest)
      );
      setValue("grandTotal", response.grandTotal);
      setSelectedRepresentative(response.representative);
      setSelectedClient(response.requestedBy);
      // setSelectedClient(response.providerType);
    }

    setLoading(false);
  };

  useEffect(() => {
    // fetchAircrafts(selectedAircraftCategory || null);
    fetchAircrafts();
    fetchRepresentatives(null);
    fetchQuote();
  }, [id, setValue]);

  // Submit updated data
  const onSubmit = async (data) => {
    await useGql({
      query: UPDATE_QUOTE,
      queryName: "",
      queryType: "mutation",
      variables: { input: { id, update: { ...data, providerType: "airops" } } },
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
    let grandTotal =
      prices?.reduce((sum, item) => sum + (Number(item.total) || 0), 0) || 0;

    grandTotal = Math.round(grandTotal * 100) / 100;

    setValue("grandTotal", grandTotal, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [prices, setValue]);

  const handleAddFee = (selectedFee) => {
    if (!selectedFee) return;

    appendPrice({
      label: selectedFee.label,
      unit: "01:00",
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

  // const steps = ["General Information", "Itinerary Details", "Price"];
  const steps = ["Enquiry", "Sectors", "Price", "Review"];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleSubDialogClose = async () => {
    setSubDialogOpen(false);
    await fetchClients();
  };

  const handleRepresentativeDialogClose = async () => {
    setRepresentativeDialogOpen(false);
    await fetchClients();
  };

  const getFlightSegementsForCalender = async (startDate, endDate) => {
    const response = await useGql({
      query: FLIGHT_SEGMENTS_FOR_CALENDER,
      queryName: "flightSegmentsForCalendar",
      queryType: "query-without-edge",
      variables: {
        "startDate": startDate,
        "endDate": endDate,
      },
    });

    if (response.length) {
      setEvents(response.map(({ __typename, ...rest }) => rest));
    }
  };

  useEffect(() => {
    if (activeStep === 1) {
      const startDate = moment.utc().startOf("month").toISOString();
      const endDate = moment.utc().endOf("month").toISOString();

      getFlightSegementsForCalender(startDate, endDate);
    }
  }, [activeStep]);

  const handleDatesSet = (arg) => {
    const startDate = moment.utc(arg.start).startOf("day").toISOString();
    const endDate = moment.utc(arg.end).endOf("day").toISOString();

    getFlightSegementsForCalender(startDate, endDate);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              bgcolor: "#ffffff",
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              {steps[activeStep]}
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="requestedBy"
                      control={control}
                      rules={{ required: "Requested By is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          options={clients}
                          getOptionLabel={(option) => option.name}
                          value={
                            field.value
                              ? clients.find((c) => c.id === field.value)
                              : null
                          }
                          onChange={(_, newValue) => {
                            setSelectedClient(newValue);
                            field.onChange(newValue ? newValue.id : "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Requested By"
                              size="small"
                              placeholder="Select Client"
                              slotProps={{
                                inputLabel: {
                                  shrink: true,
                                },
                              }}
                              required
                              fullWidth
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} display="flex" alignItems="center">
                    <IconButton
                      aria-label="add"
                      color="primary"
                      onClick={() => setSubDialogOpen(true)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>

                  {selectedClient?.isCompany && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="representative"
                          control={control}
                          rules={{ required: "Representative is required" }}
                          render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                              {...field}
                              options={representatives}
                              getOptionLabel={(option) => option.name}
                              value={
                                field.value
                                  ? representatives.find(
                                      (rep) => rep.id === field.value
                                    )
                                  : null
                              }
                              onChange={(_, newValue) =>
                                field.onChange(newValue ? newValue.id : "")
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Representative"
                                  size="small"
                                  placeholder="Select Representative"
                                  slotProps={{
                                    inputLabel: {
                                      shrink: true,
                                    },
                                  }}
                                  required
                                  fullWidth
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={6}
                        display="flex"
                        alignItems="center"
                      >
                        <IconButton
                          aria-label="add"
                          color="primary"
                          onClick={() => setRepresentativeDialogOpen(true)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Category is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          select
                          fullWidth
                          label="Category"
                          {...field}
                          error={!!error}
                          helperText={error?.message}
                          size="small"
                        >
                          {categoryOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="aircraft"
                      control={control}
                      rules={{ required: "Aircraft is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          options={aircrafts}
                          getOptionLabel={(option) => option.code}
                          value={
                            field.value
                              ? aircrafts.find(
                                  (aircraft) => aircraft.id === field.value
                                )
                              : null
                          }
                          onChange={(_, value) => {
                            field.onChange(value ? value.id : "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Aircraft"
                              placeholder="Select Aircraft"
                              slotProps={{
                                inputLabel: {
                                  shrink: true,
                                },
                              }}
                              required
                              fullWidth
                              size="small"
                              error={!!error}
                              helperText={error?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Box sx={{ display: "flex", mt: 5 }}>
                  <Box sx={{ flex: 0.4, pr: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      {itineraryFields.map((item, index) => (
                        <Grid
                          container
                          spacing={2}
                          key={item.id}
                          alignItems="center"
                          sx={{ mt: 2, borderBottom: "1px solid #ddd", pb: 2 }}
                        >
                          <Grid item xs={6}>
                            <Controller
                              name={`itinerary.${index}.source`}
                              control={control}
                              rules={{ required: "From is required" }}
                              render={({ field, fieldState: { error } }) => (
                                <AirportsAutocomplete
                                  {...field}
                                  label="From"
                                  isRequired={true}
                                  error={error}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Controller
                              name={`itinerary.${index}.destination`}
                              control={control}
                              rules={{ required: "To is required" }}
                              render={({ field, fieldState: { error } }) => (
                                <AirportsAutocomplete
                                  {...field}
                                  label="To"
                                  isRequired={true}
                                  error={error}
                                />
                              )}
                            />
                          </Grid>

                          <Grid item xs={6}>
                            <Controller
                              name={`itinerary.${index}.depatureDate`}
                              control={control}
                              rules={{ required: "Date is required" }}
                              render={({ field, fieldState: { error } }) => (
                                <DatePicker
                                  {...field}
                                  format="DD-MM-YYYY"
                                  value={
                                    field.value ? moment(field.value) : null
                                  }
                                  // value={
                                  //   field.value ? moment(field.value) : moment()
                                  // } // fallback
                                  // onChange={(newValue) =>
                                  //   field.onChange(newValue)
                                  // }
                                  onChange={(newValue) =>
                                    field.onChange(
                                      newValue
                                        ? moment(newValue).format("YYYY-MM-DD")
                                        : ""
                                    )
                                  }
                                  minDate={moment()} // Disable past dates
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
                          <Grid item xs={6}>
                            <Controller
                              name={`itinerary.${index}.depatureTime`}
                              control={control}
                              rules={{
                                required: "Departure time is required",
                                validate: (value) =>
                                  validateDepartureTime(
                                    watch(`itinerary.${index}.depatureDate`),
                                    value
                                  ),
                              }}
                              render={({ field, fieldState: { error } }) => {
                                const depDate = watch(
                                  `itinerary.${index}.depatureDate`
                                );
                                const minTime = getMinDepartureTime(depDate);

                                return (
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
                                          : ""
                                      )
                                    }
                                    label="Departure Time"
                                    size="small"
                                    format="HH:mm"
                                    minTime={minTime}
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
                                );
                              }}
                            />
                          </Grid>

                          <Grid item xs={6}>
                            <Controller
                              name={`itinerary.${index}.arrivalDate`}
                              control={control}
                              rules={{
                                required: "Arrival Date is required",
                                validate: validateArrivalAfterDeparture(
                                  getValues,
                                  index
                                ),
                              }}
                              render={({ field, fieldState: { error } }) => {
                                const departureDate = watch(
                                  `itinerary.${index}.depatureDate`
                                );
                                return (
                                  <DatePicker
                                    {...field}
                                    format="DD-MM-YYYY"
                                    value={
                                      field.value ? moment(field.value) : null
                                    }
                                    // onChange={(newValue) =>
                                    //   field.onChange(newValue)
                                    // }
                                    onChange={(newValue) =>
                                      field.onChange(
                                        newValue
                                          ? moment(newValue).format(
                                              "YYYY-MM-DD"
                                            )
                                          : ""
                                      )
                                    }
                                    minDate={
                                      departureDate
                                        ? moment(departureDate)
                                        : moment()
                                    } // Dynamically disable earlier dates
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                        size: "small",
                                        error: !!error,
                                        helperText: error?.message,
                                        required: true,
                                      },
                                    }}
                                  />
                                );
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Controller
                              name={`itinerary.${index}.arrivalTime`}
                              control={control}
                              rules={{
                                required: "Arrival Time is required",
                                validate: validateArrivalTime(getValues, index),
                              }}
                              render={({ field, fieldState: { error } }) => (
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
                                        : ""
                                    )
                                  }
                                  label="Arrival Time"
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

                          <Grid item xs={6}>
                            <Controller
                              name={`itinerary.${index}.paxNumber`}
                              control={control}
                              rules={{
                                min: {
                                  value: 0,
                                  message: "PAX must be at least 0",
                                },
                              }}
                              render={({ field, fieldState: { error } }) => (
                                <TextField
                                  {...field}
                                  type="number"
                                  fullWidth
                                  size="small"
                                  label="PAX"
                                  error={!!error}
                                  helperText={error?.message}
                                  inputProps={{ min: 0 }}
                                />
                              )}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            {index < 5 && (
                              <IconButton aria-label="add">
                                <AddIcon onClick={addItinerary} />
                              </IconButton>
                            )}

                            {index > 0 && (
                              <IconButton aria-label="delete">
                                <DeleteIcon
                                  onClick={() => removeItinerary(index)}
                                />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                      ))}
                    </LocalizationProvider>
                  </Box>

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
                      timeZone="UTC"
                      // timeZone="local"
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                      }}
                      events={events}
                      datesSet={handleDatesSet}
                      eventTimeFormat={{
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // This is crucial for 24-hour format
                      }}
                      slotLabelFormat={{
                        hour: "numeric",
                        minute: "2-digit",
                        meridiem: "short",
                      }}
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
                      <h4 style={{ margin: "0px" }}>Unit (Hrs)</h4>
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
                      <LocalizationProvider dateAdapter={AdapterMoment}>
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
                              render={({ field, fieldState: { error } }) => (
                                <TextField
                                  {...field}
                                  label="Label"
                                  fullWidth
                                  size="small"
                                  slotProps={{
                                    inputLabel: {
                                      shrink: true,
                                    },
                                  }}
                                  required
                                  error={!!error}
                                  helperText={error?.message}
                                />
                              )}
                            />
                          </Grid>

                          {/* <Grid item xs={1.5}>
                          <Controller
                            name={`prices.${index}.unit`}
                            control={control}
                            rules={{
                              required: "Unit is required",
                              minLength: {
                                value: 1,
                                message: "Unit must be at least 1 character",
                              },
                              pattern: {
                                value: /^[0-9]+$/,
                                message: "Unit must be a number",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Unit (hours)"
                                fullWidth
                                size="small"
                                type="text" // keep type text so string is passed
                                inputProps={{
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  if (/^\d*$/.test(value)) {
                                    field.onChange(value);

                                    const intValue =
                                      value === "" ? 0 : parseInt(value, 10);

                                    if (intValue >= 1) {
                                      const priceValue = getValues(
                                        `prices.${index}.price`
                                      );
                                      if (priceValue) {
                                        const total = intValue * priceValue;
                                        const roundedTotal =
                                          Math.round(total * 100) / 100;
                                        setValue(
                                          `prices.${index}.total`,
                                          roundedTotal
                                        );
                                      }
                                    } else {
                                      setValue(`prices.${index}.total`, 0);
                                    }
                                  }
                                }}
                                required
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </Grid> */}

                          <Grid item xs={1.5}>
                            <Controller
                              name={`prices.${index}.unit`}
                              control={control}
                              rules={{
                                required: "Unit is required",
                              }}
                              render={({ field, fieldState: { error } }) => (
                                <TimeField
                                  {...field}
                                  value={
                                    field.value
                                      ? moment(field.value, "HH:mm")
                                      : null
                                  }
                                  onChange={(newValue) => {
                                    const formatted = newValue
                                      ? moment(newValue).format("HH:mm")
                                      : "";
                                    field.onChange(formatted);

                                    if (formatted) {
                                      const [hh, mm] = formatted
                                        .split(":")
                                        .map(Number);
                                      const decimalHours = hh + mm / 60;

                                      const priceValue = getValues(
                                        `prices.${index}.price`
                                      );
                                      if (priceValue) {
                                        const total = decimalHours * priceValue;
                                        const roundedTotal =
                                          Math.round(total * 100) / 100;
                                        setValue(
                                          `prices.${index}.total`,
                                          roundedTotal
                                        );
                                      }
                                    } else {
                                      setValue(`prices.${index}.total`, 0);
                                    }
                                  }}
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
                                  // onChange={(e) => {
                                  //   const value = e.target.value;
                                  //   if (
                                  //     /^[0-9]*(\.[0-9]+)?$/.test(value) ||
                                  //     value === ""
                                  //   ) {
                                  //     field.onChange(value ? Number(value) : "");

                                  //     const unitString = getValues(
                                  //       `prices.${index}.unit`
                                  //     );
                                  //     const decimalUnit =
                                  //       parseUnitToDecimal(unitString);

                                  //     console.log(
                                  //       "decimalUnit",
                                  //       decimalUnit,
                                  //       unitString
                                  //     );
                                  //     if (unitString && decimalUnit) {
                                  //       const total = decimalUnit * Number(value);
                                  //       // Round to 2 decimals
                                  //       const roundedTotal =
                                  //         Math.round(total * 100) / 100;

                                  //       setValue(
                                  //         `prices.${index}.total`,
                                  //         roundedTotal
                                  //       );
                                  //     }
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (
                                      /^[0-9]*(\.[0-9]+)?$/.test(value) ||
                                      value === ""
                                    ) {
                                      field.onChange(
                                        value ? Number(value) : ""
                                      );

                                      const unitString = getValues(
                                        `prices.${index}.unit`
                                      );
                                      const match = unitString?.match(
                                        /^(\d{1,2}):([0-5][0-9])$/
                                      );
                                      if (match) {
                                        const hours = parseInt(match[1], 10);
                                        const minutes = parseInt(match[2], 10);
                                        const decimalHours =
                                          hours + minutes / 60;

                                        const total =
                                          decimalHours * Number(value);
                                        const roundedTotal =
                                          Math.round(total * 100) / 100;
                                        setValue(
                                          `prices.${index}.total`,
                                          roundedTotal
                                        );
                                      }
                                    }
                                  }}
                                  required
                                  error={!!error}
                                  helperText={error?.message}
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
                            <IconButton
                              onClick={() => removePrice(index)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </LocalizationProvider>
                    </>
                  ))}
                  <Grid item xs={1.5}>
                    <IconButton aria-label="Add" onClick={handleAddFee}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
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
              )}
              {activeStep === 3 && (
                <>
                  <div className="space-y-4">
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        marginTop: "24px",
                      }}
                    >
                      Enquiry:
                    </h2>

                    <div className="space-y-2">
                      <p>
                        <strong>Enquiry From:</strong>{" "}
                        {clients?.find(
                          (client) => client.id === getValues("requestedBy")
                        )?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Representative:</strong>{" "}
                        {representatives?.find(
                          (rep) => rep.id === getValues("representative")
                        )?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {/* {aircraftCategories?.find(
                          (category) => category.id === getValues("category")
                        )?.name || "N/A"} */}
                        {getValues("category") || "N/A"}
                      </p>
                      <p>
                        <strong>Aircraft:</strong>{" "}
                        {aircrafts?.find(
                          (aircraft) => aircraft.id === getValues("aircraft")
                        )?.name || "N/A"}
                      </p>
                      {/* Repeat similar lines for other fields if needed */}
                    </div>

                    {/* Itinerary Section */}
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        marginTop: "24px",
                      }}
                    >
                      Sectors:
                    </h2>
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          border: "1px solid #ccc",
                          borderCollapse: "collapse",
                          marginTop: "8px",
                        }}
                      >
                        <thead>
                          <tr style={{ backgroundColor: "#f5f5f5" }}>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Source
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Destination
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Depature Date
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Depature Time
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Arrival Date
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Arrival Time
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Pax
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getValues("itinerary")?.length > 0 ? (
                            getValues("itinerary").map((item, index) => (
                              <tr key={index}>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.source}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.destination}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {moment(item.depatureDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.depatureTime}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {moment(item.arrivalDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.arrivalTime}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.paxNumber}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={7}
                                style={{
                                  border: "1px solid #ccc",
                                  padding: "8px",
                                  textAlign: "center",
                                }}
                              >
                                No itinerary
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Price Section */}
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        marginTop: "24px",
                      }}
                    >
                      Price:
                    </h2>
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          border: "1px solid #ccc",
                          borderCollapse: "collapse",
                          marginTop: "8px",
                        }}
                      >
                        <thead>
                          <tr style={{ backgroundColor: "#f5f5f5" }}>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Label
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Unit(Hrs)
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Price
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Currency
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Margin
                            </th>
                            <th
                              style={{
                                border: "1px solid #ccc",
                                padding: "8px",
                              }}
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getValues("prices")?.length > 0 ? (
                            getValues("prices").map((item, index) => (
                              <tr key={index}>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.label}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.unit}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.price}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.currency}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.margin}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "8px",
                                  }}
                                >
                                  {item.total}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={6}
                                style={{
                                  border: "1px solid #ccc",
                                  padding: "8px",
                                  textAlign: "center",
                                }}
                              >
                                No price details
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p>
                      <strong>Total:</strong> {getValues("grandTotal") || 0}
                    </p>
                  </div>
                </>
              )}

              {/* <Box
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
                  <Button
                    variant="contained"
                    onClick={handleSubmit(() => setActiveStep(activeStep + 1))}
                  >
                    Next
                  </Button>
                )}
              </Box> */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 3,
                }}
              >
                <Box>
                  {activeStep !== 0 ? (
                    <Button onClick={handleBack} disabled={activeStep === 0}>
                      Back
                    </Button>
                  ) : (
                    // This is the key change: an invisible placeholder
                    <Box sx={{ visibility: "hidden" }}>
                      <Button>Back</Button>
                    </Box>
                  )}
                </Box>

                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button type="submit" variant="contained" color="success">
                      Submit
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit(() =>
                        setActiveStep(activeStep + 1)
                      )}
                      variant="contained"
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
      <ClientDialog
        subDialogOpen={subDialogOpen}
        handleSubDialogClose={handleSubDialogClose}
        clientId={selectedClient?.id}
        isEdit={true}
      />

      <RepresentativeDialog
        dialogOpen={representativeDialogOpen}
        handleDialogClose={handleRepresentativeDialogClose}
        client={selectedClient}
      />
    </>
  );
};

export default QuoteEdit;
