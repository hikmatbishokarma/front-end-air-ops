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
import { Box, Grid, Stepper, Step, StepLabel } from "@mui/material";

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
import { CREATE_QUOTE } from "../../lib/graphql/queries/quote";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useSnackbar } from "../../SnackbarContext";

import { IaircraftCategory, Iclient } from "../../interfaces/quote.interface";
import { useQuoteData } from "../../hooks/useQuoteData";
import ClientDialog from "../clients/dialog";
import RepresentativeDialog from "../representative/dialog";
import { useNavigate } from "react-router";

const defaultValues = {
  requestedBy: "",
  representative: "",
  itinerary: [
    {
      source: "",
      destination: "",
      depatureDate: "",
      depatureTime: "",
      arrivalDate: "",
      arrivalTime: "",

      paxNumber: 1,
    },
  ],
  providerType: "airops",
  category: "",
  aircraft: "",
  prices: [
    {
      label: "Discount",
      unit: "",
      price: 0,
      currency: "INR",
      total: 0,
      margin: 0,
    }, // Default empty row
  ],
  grandTotal: 0,
};

export const QuoteCreate = ( ) => {

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

  const [selectedAircraftCategory, setSelectedAircraftCategory] =
    useState<IaircraftCategory | null>(null);

  const [selectedClient, setSelectedClient] = useState<Iclient | null>();

  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]);

  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues,
  });
  const steps = ["General Information", "Itinerary Details", "Price"];

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
    console.log("Form Data:", data);
    createQuote(data);
    // setIsNewQuote(false);
    navigate("/");
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
      console.log("✅ All Fields Filled - Updating Event", lastItinerary);

      setEvents((prevEvents: any) => {
        // Check if an event with the same source-destination already exists
        const updatedEvents = prevEvents.map((event: any) =>
          event.title === `${lastItinerary.source}-${lastItinerary.destination}`
            ? {
                ...event,
                start: moment
                  .utc(
                    `${moment(lastItinerary.depatureDate, "DD-MM-YYYY").format("YYYY-MM-DD")} ${lastItinerary.depatureTime}`,
                    "YYYY-MM-DD HH:mm",
                  )
                  .format("YYYY-MM-DD HH:mm"),
                end: moment
                  .utc(
                    `${moment(lastItinerary.arrivalDate, "DD-MM-YYYY").format("YYYY-MM-DD")} ${lastItinerary.arrivalTime}`,
                    "YYYY-MM-DD HH:mm",
                  )
                  .format("YYYY-MM-DD HH:mm"),
              }
            : event,
        );

        // If event does not exist, add it
        const eventExists = prevEvents.some(
          (event: any) =>
            event.title ===
            `${lastItinerary.source}-${lastItinerary.destination}`,
        );

        if (!eventExists) {
          updatedEvents.push({
            title: `${lastItinerary.source}-${lastItinerary.destination}`,
            start: moment
              .utc(
                `${moment(lastItinerary.depatureDate, "DD-MM-YYYY").format("YYYY-MM-DD")} ${lastItinerary.depatureTime}`,
                "YYYY-MM-DD HH:mm",
              )
              .format("YYYY-MM-DD HH:mm"),
            end: moment
              .utc(
                `${moment(lastItinerary.arrivalDate, "DD-MM-YYYY").format("YYYY-MM-DD")} ${lastItinerary.arrivalTime}`,
                "YYYY-MM-DD HH:mm",
              )
              .format("YYYY-MM-DD HH:mm"),
          });
        }

        return updatedEvents;
      });
    }
  }, [JSON.stringify(itinerary)]);

  useEffect(() => {
    if (selectedAircraftCategory?.id) {
      fetchAircrafts(selectedAircraftCategory.id);
    }

    if (selectedClient?.id) {
      fetchRepresentatives(selectedClient.id);
    }
  }, [selectedAircraftCategory?.id, selectedClient?.id]);

  const handleSubDialogClose = async () => {
    setSubDialogOpen(false);
    await fetchClients();
  };

  const handleRepresentativeDialogClose = async () => {
    setRepresentativeDialogOpen(false);
    await fetchClients();
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

  const handleAddFee = () => {
    // console.log("selectedFee", selectedFee);
    // if (!selectedFee) return;
    console.log("pricccccc");
    appendPrice({
      label: "",
      unit: "0",
      price: 0,
      currency: "INR",
      margin: 0,
      total: 0, // Calculate total
    });
  };

  return (
    <>
      {/* <Dialog
        open={isNewQuote}
        onClose={() => setIsNewQuote(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Add New Quote Request</DialogTitle>
        <DialogContent>
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
                            field.onChange(newValue ? newValue.id : ""); 
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
                      onClick={() => setSubDialogOpen(true)}
                    >
                      Add Client
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
                            field.onChange(newValue ? newValue.id : ""); 
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
                      onClick={() => setRepresentativeDialogOpen(true)}
                    >
                      Add Rep
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
                 
                  <Box sx={{ flex: 0.4, pr: 2 }}>
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
                          sx={{ display: "flex", justifyContent: "flex-end" }}
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
                    ))}

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
 
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewQuote(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog> */}
   
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
                            field.onChange(newValue ? newValue.id : ""); 
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
                      onClick={() => setSubDialogOpen(true)}
                    >
                      Add Client
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
                            field.onChange(newValue ? newValue.id : ""); 
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
                      onClick={() => setRepresentativeDialogOpen(true)}
                    >
                      Add Rep
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
                 
                  <Box sx={{ flex: 0.4, pr: 2 }}>
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
                          sx={{ display: "flex", justifyContent: "flex-end" }}
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
                    ))}

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
