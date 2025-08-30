// src/quotes/formSteps/SectorsStep.tsx
import React, { useState, useEffect } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import {
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  LocalizationProvider,
  DatePicker,
  TimeField,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import moment from "moment";
import AirportsAutocomplete from "../../../components/airport-autocommplete";
import {
  getMinDepartureTime,
  validateArrivalAfterDeparture,
  validateArrivalTime,
  validateDepartureTime,
} from "../../../lib/utils";

const SectorsStep = ({ control, watch, getValues }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itinerary",
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const itineraryData = watch("itinerary");
    const calendarEvents = itineraryData
      .filter(
        (item) =>
          item.source &&
          item.destination &&
          item.depatureDate &&
          item.depatureTime
      )
      .map((item, index) => {
        const start = moment(
          `${item.depatureDate} ${item.depatureTime}`,
          "YYYY-MM-DD HH:mm"
        ).toISOString();
        const end =
          item.arrivalDate && item.arrivalTime
            ? moment(
                `${item.arrivalDate} ${item.arrivalTime}`,
                "YYYY-MM-DD HH:mm"
              ).toISOString()
            : null;

        return {
          id: index,
          title: `Flight ${index + 1}: ${item.source} to ${item.destination}`,
          start: start,
          end: end,
          color: "#007bff",
        };
      });
    setEvents(calendarEvents);
  }, [watch]);

  const handleDatesSet = (dateInfo) => {
    console.log("Calendar dates set:", dateInfo.startStr, dateInfo.endStr);
  };

  const addItinerary = () => {
    append({
      source: "",
      destination: "",
      depatureDate: moment().format("YYYY-MM-DD"),
      depatureTime: "",
      arrivalDate: moment().format("YYYY-MM-DD"),
      arrivalTime: "",
      paxNumber: 0,
    });
  };

  const removeItinerary = (index) => {
    remove(index);
  };

  return (
    <Box sx={{ display: "flex", mt: 5 }} className="sector-map">
      <Box sx={{ flex: 0.4, pr: 2 }}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          {fields.map((item, index) => {
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
                {/* Source and Destination */}
                <Grid item xs={6} className="fromto">
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
                <Grid item xs={6} className="fromto">
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

                {/* Departure Date and Time */}
                <Grid item xs={6} className="fromto">
                  <Controller
                    name={`itinerary.${index}.depatureDate`}
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        format="DD-MM-YYYY"
                        value={field.value ? moment(field.value) : null}
                        onChange={(newValue) =>
                          field.onChange(
                            newValue
                              ? moment(newValue).format("YYYY-MM-DD")
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
                <Grid item xs={6} className="fromto">
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
                      const depDate = watch(`itinerary.${index}.depatureDate`);
                      const minTime = getMinDepartureTime(depDate);

                      return (
                        <TimeField
                          {...field}
                          value={
                            field.value ? moment(field.value, "HH:mm") : null
                          }
                          onChange={(newValue) =>
                            field.onChange(
                              newValue ? moment(newValue).format("HH:mm") : ""
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

                {/* Arrival Date and Time */}
                <Grid item xs={6} className="fromto">
                  <Controller
                    name={`itinerary.${index}.arrivalDate`}
                    control={control}
                    rules={{
                      required: "Arrival Date is required",
                      validate: validateArrivalAfterDeparture(getValues, index),
                    }}
                    render={({ field, fieldState: { error } }) => {
                      const departureDate = watch(
                        `itinerary.${index}.depatureDate`
                      );
                      return (
                        <DatePicker
                          {...field}
                          format="DD-MM-YYYY"
                          value={field.value ? moment(field.value) : null}
                          onChange={(newValue) =>
                            field.onChange(
                              newValue
                                ? moment(newValue).format("YYYY-MM-DD")
                                : ""
                            )
                          }
                          minDate={
                            departureDate ? moment(departureDate) : moment()
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
                <Grid item xs={6} className="fromto">
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
                          field.value ? moment(field.value, "HH:mm") : null
                        }
                        onChange={(newValue) =>
                          field.onChange(
                            newValue ? moment(newValue).format("HH:mm") : ""
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

                {/* PAX Number and Buttons */}
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
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {index < 5 && (
                    <IconButton aria-label="add" className="add-icon-v1">
                      <AddIcon onClick={addItinerary} />
                    </IconButton>
                  )}

                  {index > 0 && (
                    <IconButton aria-label="delete" className="add-icon-v1">
                      <DeleteIcon onClick={() => removeItinerary(index)} />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            );
          })}
        </LocalizationProvider>
      </Box>

      {/* Calendar Section */}
      <Box
        className="calendar-right"
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
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
        />
      </Box>
    </Box>
  );
};

export default SectorsStep;
