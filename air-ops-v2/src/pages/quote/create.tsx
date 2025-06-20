import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Container,
  Divider,
  MenuItem,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import AirportsAutocomplete from "../../components/airport-autocommplete";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimeField,
} from "@mui/x-date-pickers";
import moment from "moment";
import { Delete } from "@mui/icons-material";
import useGql from "../../lib/graphql/gql";
import {
  CREATE_QUOTE,
  FLIGHT_SEGMENTS_FOR_CALENDER,
} from "../../lib/graphql/queries/quote";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useSnackbar } from "../../SnackbarContext";

import { IaircraftCategory, Iclient } from "../../interfaces/quote.interface";
import { useQuoteData } from "../../hooks/useQuoteData";
import ClientDialog from "../clients/dialog";
import RepresentativeDialog from "../representative/dialog";
import { useNavigate } from "react-router";
import { useSession } from "../../SessionContext";

const defaultValues = {
  requestedBy: "",
  representative: undefined,
  itinerary: [
    {
      source: "",
      destination: "",
      // depatureDate: moment().format("YYYY-MM-DD"), // default current date
      depatureDate: "", // default current date
      depatureTime: "",
      arrivalDate: "",
      arrivalTime: "",

      paxNumber: 1,
    },
  ],
  providerType: "airops",
  category: undefined,
  aircraft: undefined,
  prices: [
    {
      label: "Charter Charges",
      unit: "1",
      price: 0,
      currency: "INR",
      total: 0,
    },
    {
      label: "Ground Handling",
      unit: "1",
      price: 0,
      currency: "INR",
      total: 0,
    },
    {
      label: "Crew BLT",
      unit: "1",
      price: 0,
      currency: "INR",
      total: 0,
    },
  ],
  grandTotal: 0,
};

export const parseUnitToDecimal = (unitString: string): number => {
  if (!unitString) return 0;

  if (unitString.includes(":")) {
    const [hoursStr, minutesStr] = unitString.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours + minutes / 60;
  } else {
    const hours = Number(unitString);
    return isNaN(hours) ? 0 : hours;
  }
};

export const validateArrivalTime =
  (getValues: any, index: number) => (arrivalTime: string) => {
    const depDate = getValues(`itinerary.${index}.depatureDate`);
    const depTime = getValues(`itinerary.${index}.depatureTime`);
    const arrDate = getValues(`itinerary.${index}.arrivalDate`);

    if (!depDate || !depTime || !arrDate || !arrivalTime) return true;

    // Parse all times as moment objects using consistent format
    const depDateTime = moment(
      `${moment(depDate).format("YYYY-MM-DD")} ${depTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const arrDateTime = moment(
      `${moment(arrDate).format("YYYY-MM-DD")} ${arrivalTime}`,
      "YYYY-MM-DD HH:mm"
    );

    // Validate
    return arrDateTime.isSameOrAfter(depDateTime)
      ? true
      : "Arrival must be after departure";
  };

export const validateArrivalAfterDeparture =
  (getValues, index) => (arrivalDate) => {
    const departureDate = getValues(`itinerary.${index}.depatureDate`);
    if (!arrivalDate || !departureDate) return true;
    return (
      moment(arrivalDate).isSameOrAfter(moment(departureDate), "day") ||
      "Arrival date must be same as or after departure date"
    );
  };

export function validateDepartureTime(
  depDate: string | null | undefined,
  timeValue: string | undefined
) {
  if (!timeValue) return "Departure time is required";
  if (!depDate) return true; // Can't validate without date

  const today = moment().startOf("day");
  const isToday = moment(depDate).isSame(today, "day");

  const minDateTime = isToday
    ? moment() // Current time
    : moment(depDate).startOf("day"); // Start of depDate day

  const inputDateTime = moment(depDate)
    .hour(moment(timeValue, "HH:mm").hour())
    .minute(moment(timeValue, "HH:mm").minute())
    .second(0)
    .millisecond(0);

  if (inputDateTime.isBefore(minDateTime)) {
    return "Departure time cannot be in the past";
  }

  return true;
}

export function getMinDepartureTime(depDate: string | null | undefined) {
  if (!depDate) return moment("00:00", "HH:mm");
  const today = moment().startOf("day");
  const isToday = moment(depDate).isSame(today, "day");
  return isToday ? moment() : moment("00:00", "HH:mm");
}

export const categoryOptions = [
  {
    id: "CHARTER",
    name: "Charter",
  },
  {
    id: "IN_HOUSE",
    name: "In House",
  },
  {
    id: "TEST_FLIGHT",
    name: "Test Flight",
  },
  {
    id: "TRAINING",
    name: "Training",
  },
  { id: "GROUND_RUN", name: "Ground Run" },
];

export const QuoteCreate = () => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const navigate = useNavigate();

  const showSnackbar = useSnackbar();
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [representativeDialogOpen, setRepresentativeDialogOpen] =
    useState(false);

  const {
    aircraftCategories,
    aircrafts,
    representatives,
    clients,
    fetchClients,
    fetchAircrafts,
    fetchRepresentatives,
  } = useQuoteData();

  // const [selectedAircraftCategory, setSelectedAircraftCategory] =
  //   useState<IaircraftCategory | null>(null);

  const [selectedClient, setSelectedClient] = useState<Iclient | null>();

  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]);

  const { control, handleSubmit, setValue, watch, reset, getValues } = useForm({
    defaultValues,
  });
  const steps = ["General Information", "Itinerary Details", "Price", "Review"];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

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

  const createQuote = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_QUOTE,
        queryName: "quote",
        queryType: "mutation",
        variables: {
          input: {
            quote: formData,
          },
        },
      });
      console.log("dataaaa", data);
      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Create Quote!", "error");
      } else showSnackbar("Created new Quote!", "success");
    } catch (error) {
      showSnackbar(error?.message || "Failed To Create Quote!", "error");
    }
  };

  const onSubmit = (data: any) => {
    createQuote({ ...data, operatorId });
    // setIsNewQuote(false);
    navigate("/quotes");
    reset();
  };

  const itinerary = watch("itinerary", []);

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

  useEffect(() => {
    const lastIndex = itinerary.length - 1;
    const lastItinerary = itinerary[lastIndex];

    console.log("lastItinerary:::", lastItinerary);

    if (
      lastItinerary?.source &&
      lastItinerary?.destination &&
      lastItinerary?.depatureDate &&
      lastItinerary?.arrivalDate &&
      lastItinerary?.depatureTime &&
      lastItinerary?.arrivalTime
    ) {
      // console.log("✅ All Fields Filled - Updating Event", lastItinerary);

      // setEvents((prevEvents: any) => {
      //   // Check if an event with the same source-destination already exists
      //   const updatedEvents = prevEvents.map((event: any) =>
      //     event.title === `${lastItinerary.source}-${lastItinerary.destination}`
      //       ? {
      //           ...event,
      //           start: moment
      //             .utc(
      //               `${moment(lastItinerary.depatureDate, "DD-MM-YYYY").format("YYYY-MM-DD")} ${lastItinerary.depatureTime}`,
      //               "YYYY-MM-DD HH:mm"
      //             )
      //             .format("YYYY-MM-DD HH:mm"),
      //           end: moment
      //             .utc(
      //               `${moment(lastItinerary.arrivalDate, "DD-MM-YYYY").format("YYYY-MM-DD")} ${lastItinerary.arrivalTime}`,
      //               "YYYY-MM-DD HH:mm"
      //             )
      //             .format("YYYY-MM-DD HH:mm"),
      //         }
      //       : event
      //   );

      //   // If event does not exist, add it
      //   const eventExists = prevEvents.some(
      //     (event: any) =>
      //       event.title ===
      //       `${lastItinerary.source}-${lastItinerary.destination}`
      //   );

      //   if (!eventExists) {
      //     updatedEvents.push({
      //       title: `${lastItinerary.source}-${lastItinerary.destination}`,
      //       start: moment
      //         .utc(
      //           `${moment(lastItinerary.depatureDate, "DD-MM-YYYY").format("YYYY-MM-DD")} ${lastItinerary.depatureTime}`,
      //           "YYYY-MM-DD HH:mm"
      //         )
      //         .format("YYYY-MM-DD HH:mm"),
      //       end: moment
      //         .utc(
      //           `${moment(lastItinerary.arrivalDate, "DD-MM-YYYY").format("YYYY-MM-DD")} ${lastItinerary.arrivalTime}`,
      //           "YYYY-MM-DD HH:mm"
      //         )
      //         .format("YYYY-MM-DD HH:mm"),
      //     });
      //   }

      //   console.log("updatedEvents:::", updatedEvents);

      //   return updatedEvents;
      // });

      // Build start datetime in UTC
      const depTimeParts = lastItinerary.depatureTime.split(":");
      const startDateTime = moment
        .utc(lastItinerary.depatureDate)
        .set({
          hour: Number(depTimeParts[0]),
          minute: Number(depTimeParts[1]),
          second: 0,
          millisecond: 0,
        })
        .toISOString();

      // Build end datetime in UTC
      const arrTimeParts = lastItinerary.arrivalTime.split(":");
      const endDateTime = moment
        .utc(lastItinerary.arrivalDate)
        .set({
          hour: Number(arrTimeParts[0]),
          minute: Number(arrTimeParts[1]),
          second: 0,
          millisecond: 0,
        })
        .toISOString();

      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((event) =>
          event.title === `${lastItinerary.source}-${lastItinerary.destination}`
            ? {
                ...event,
                start: startDateTime,
                end: endDateTime,
              }
            : event
        );

        const eventExists = prevEvents.some(
          (event) =>
            event.title ===
            `${lastItinerary.source}-${lastItinerary.destination}`
        );

        if (!eventExists) {
          updatedEvents.push({
            title: `${lastItinerary.source}-${lastItinerary.destination}`,
            start: startDateTime,
            end: endDateTime,
          });
        }

        console.log("✅ updatedEvents:::", updatedEvents);
        return updatedEvents;
      });
    }
  }, [JSON.stringify(itinerary)]);

  useEffect(() => {
    // if (selectedAircraftCategory?.id) {
    //   fetchAircrafts(selectedAircraftCategory.id);
    // }

    if (selectedClient?.id) {
      fetchRepresentatives(selectedClient.id);
    }
  }, [selectedClient?.id]);

  const handleSubDialogClose = async () => {
    setSubDialogOpen(false);
    await fetchClients();
  };

  const handleRepresentativeDialogClose = async () => {
    setRepresentativeDialogOpen(false);
    await fetchRepresentatives(selectedClient?.id);
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

  const handleAddFee = () => {
    appendPrice({
      label: "",
      unit: "1",
      price: 0,
      currency: "INR",
      total: 0, // Calculate total
    });
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

  console.log("eventss:", events);

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
                      {itineraryFields.map((item, index) => {
                        return (
                          <Grid
                            container
                            spacing={2}
                            key={item.id}
                            alignItems="center"
                            sx={{
                              mt: 2,
                              borderBottom: "1px solid #ddd",
                              pb: 2,
                            }}
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
                                    minDate={moment()}
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
                                      }
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
                                  validate: validateArrivalTime(
                                    getValues,
                                    index
                                  ),
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

                            <Grid
                              item
                              xs={6}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
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
                        );
                      })}
                    </LocalizationProvider>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addItinerary}
                    >
                      Add Itinerary
                    </Button>
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
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                      }}
                      events={events}
                      datesSet={handleDatesSet}
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

                        <Grid item xs={1.5}>
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
                                }} // numeric keyboard on mobile
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Allow only digits or empty
                                  if (/^\d*$/.test(value)) {
                                    field.onChange(value); // send string to form (and backend)

                                    // parse for calculation
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
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    /^[0-9]*(\.[0-9]+)?$/.test(value) ||
                                    value === ""
                                  ) {
                                    field.onChange(value ? Number(value) : "");

                                    const unitString = getValues(
                                      `prices.${index}.unit`
                                    );
                                    const decimalUnit =
                                      parseUnitToDecimal(unitString);

                                    console.log(
                                      "decimalUnit",
                                      decimalUnit,
                                      unitString
                                    );
                                    if (unitString && decimalUnit) {
                                      const total = decimalUnit * Number(value);
                                      // Round to 2 decimals
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
                    <h2 className="text-xl font-semibold">Basic Info</h2>

                    <div className="space-y-2">
                      <p>
                        <strong>Requested By:</strong>{" "}
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
                      Itinerary
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
                          <tr style={{ backgroundColor: "#DDD" }}>
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
                      Price
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
                          <tr style={{ backgroundColor: "#DDD" }}>
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
                      <strong>Total:</strong> {getValues("grandTotal") || "N/A"}
                    </p>
                  </div>
                </>
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
                  <Button
                    variant="contained"
                    onClick={handleSubmit(() => setActiveStep(activeStep + 1))}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
      <ClientDialog
        subDialogOpen={subDialogOpen}
        handleSubDialogClose={handleSubDialogClose}
      />

      <RepresentativeDialog
        dialogOpen={representativeDialogOpen}
        handleDialogClose={handleRepresentativeDialogClose}
        client={selectedClient}
      />
    </>
  );
};

export default QuoteCreate;
