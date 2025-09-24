// src/quotes/formSteps/SectorsStep.tsx
import React, { useState, useEffect } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Grid, Box, Typography, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

import {
  getMinDepartureTime,
  validateArrivalAfterDeparture,
  validateArrivalTime,
  validateDepartureTime,
} from "../../../lib/utils";
import LocationAutocomplete from "../../../components/LocationAutocomplete";

const SectorsStepV2 = ({ control, watch, getValues, setValue }) => {
  const {
    fields,
    append: appendSector,
    remove: removeSector,
  } = useFieldArray({
    control,
    name: "sectors",
  });

  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]);

  const [expanded, setExpanded] = useState<number | false>(0);

  const sectors = watch("sectors", []);

  // sync events for calendar
  useEffect(() => {
    const lastIndex = sectors.length - 1;
    const lastSector = sectors[lastIndex];

    if (
      lastSector?.source &&
      lastSector?.destination &&
      lastSector?.depatureDate &&
      lastSector?.arrivalDate &&
      lastSector?.depatureTime &&
      lastSector?.arrivalTime
    ) {
      const depTimeParts = lastSector.depatureTime.split(":");
      const startDateTime = moment
        .utc(lastSector.depatureDate)
        .set({
          hour: Number(depTimeParts[0]),
          minute: Number(depTimeParts[1]),
          second: 0,
        })
        .toISOString();

      const arrTimeParts = lastSector.arrivalTime.split(":");
      const endDateTime = moment
        .utc(lastSector.arrivalDate)
        .set({
          hour: Number(arrTimeParts[0]),
          minute: Number(arrTimeParts[1]),
          second: 0,
        })
        .toISOString();

      setEvents((prevEvents) => {
        const updated = [...prevEvents];
        const title = `${lastSector.source?.code}-${lastSector.destination?.code}`;

        const idx = updated.findIndex((evt) => evt.title === title);
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            start: startDateTime,
            end: endDateTime,
          };
        } else {
          updated.push({ title, start: startDateTime, end: endDateTime });
        }
        return updated;
      });
    }
  }, [JSON.stringify(sectors)]);

  const addSector = () => {
    const lastSector = watch("sectors", []); // Get the current itinerary list
    const prevDestination =
      lastSector.length > 0
        ? lastSector[lastSector.length - 1]?.destination
        : "";

    const newIndex = lastSector.length; // Get the index for the new itinerary

    appendSector({
      source: prevDestination, // Auto-fill source from the last destination
      destination: {
        iata_code: "",
        name: "",
        city: "",
        country: "",
        lat: "",
        long: "",
      },
      depatureDate: "",
      depatureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      paxNumber: 0,
    });

    // Use setValue to force update the new itinerary field
    setTimeout(() => {
      setValue(`sectors.${newIndex}.source`, prevDestination);
    }, 0); // Delay to ensure the new field is registered

    setExpanded(newIndex); // 👈 open the newly added accordion
  };

  return (
    <Box sx={{ display: "flex", mt: 5, gap: 2 }}>
      {/* Left Panel */}
      <Box
        sx={{
          flex: 0.4,
          bgcolor: "#e3f2fd",
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          {fields.map((item, index) => {
            const source = watch(`sectors.${index}.source`);
            const destination = watch(`sectors.${index}.destination`);

            // Get the arrival date of the previous sector
            const prevSectorArrivalDate =
              index > 0 ? getValues(`sectors.${index - 1}.arrivalDate`) : null;

            // Set the minimum departure date for the current sector
            const minDepartureDate = prevSectorArrivalDate
              ? moment(prevSectorArrivalDate)
              : moment();

            return (
              <Accordion
                key={item.id}
                expanded={expanded === index}
                onChange={(_, isExpanded) =>
                  setExpanded(isExpanded ? index : false)
                }
                sx={{
                  mt: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  boxShadow: 2,
                  borderLeft: "5px solid #d32f2f",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#d32f2f" }} />}
                >
                  <Typography sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                    Sector {index + 1}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={2}>
                    {/* Source */}
                    <Grid item xs={6}>
                      <Controller
                        name={`sectors.${index}.source`}
                        control={control}
                        rules={{ required: "From is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <LocationAutocomplete
                            {...field}
                            label="From"
                            error={error}
                          />
                        )}
                      />
                    </Grid>

                    {/* Destination */}
                    <Grid item xs={6}>
                      <Controller
                        name={`sectors.${index}.destination`}
                        control={control}
                        rules={{ required: "To is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <LocationAutocomplete
                            {...field}
                            label="To"
                            error={error}
                          />
                        )}
                      />
                    </Grid>

                    {/* Custom source card */}
                    {source?.code === "ZZZZ" && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            bgcolor: "#f9fafb",
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: "bold" }}
                          >
                            Heliport Source Location
                          </Typography>
                          <Controller
                            name={`sectors.${index}.source.name`}
                            control={control}
                            rules={{ required: "Location is required" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Location Name"
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                              />
                            )}
                          />
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Controller
                                name={`sectors.${index}.source.lat`}
                                control={control}
                                rules={{ required: "latitude is required" }}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Latitude"
                                    fullWidth
                                    size="small"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Controller
                                name={`sectors.${index}.source.long`}
                                rules={{ required: "longitude is required" }}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Longitude"
                                    fullWidth
                                    size="small"
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    )}

                    {/* Custom destination card */}
                    {destination?.code === "ZZZZ" && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            bgcolor: "#f9fafb",
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: "bold" }}
                          >
                            Heliport Destination Location
                          </Typography>
                          <Controller
                            name={`sectors.${index}.destination.name`}
                            control={control}
                            rules={{ required: "Location is required" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Location Name"
                                fullWidth
                                size="small"
                                sx={{ mb: 2 }}
                              />
                            )}
                          />
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Controller
                                name={`sectors.${index}.destination.lat`}
                                rules={{ required: "latitude is required" }}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Latitude"
                                    fullWidth
                                    size="small"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Controller
                                name={`sectors.${index}.destination.long`}
                                rules={{ required: "longitude is required" }}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Longitude"
                                    fullWidth
                                    size="small"
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    )}

                    {/* Departure Date and Time */}
                    <Grid item xs={6} className="fromto">
                      <Controller
                        name={`sectors.${index}.depatureDate`}
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
                            // minDate={moment()}
                            minDate={minDepartureDate}
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
                        name={`sectors.${index}.depatureTime`}
                        control={control}
                        rules={{
                          required: "Departure time is required",
                          validate: (value) =>
                            validateDepartureTime(
                              watch(`sectors.${index}.depatureDate`),
                              value
                            ),
                        }}
                        render={({ field, fieldState: { error } }) => {
                          const depDate = watch(
                            `sectors.${index}.depatureDate`
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

                    {/* Arrival Date and Time */}
                    <Grid item xs={6} className="fromto">
                      <Controller
                        name={`sectors.${index}.arrivalDate`}
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
                            `sectors.${index}.depatureDate`
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
                        name={`sectors.${index}.arrivalTime`}
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
                        name={`sectors.${index}.paxNumber`}
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
                            onChange={(e) => {
                              field.onChange(+e.target.value);
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid
                      className="add_delete_data"
                      item
                      xs={6}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      {index < 5 && (
                        <Button
                          className="add_sector_data_1"
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#d32f2f",
                            color: "#d32f2f",
                            "&:hover": { bgcolor: "#d32f2f", color: "#fff" },
                          }}
                          onClick={addSector}
                          startIcon={<AddIcon />}
                        >
                          Add
                        </Button>
                      )}

                      {index > 0 && (
                        <Button
                          className="add_sector_data_2"
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#1976d2",
                            color: "#1976d2",
                            "&:hover": { bgcolor: "#1976d2", color: "#fff" },
                          }}
                          onClick={() => removeSector(index)}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </LocalizationProvider>
      </Box>

      {/* Right Panel - Calendar */}
      <Box
        sx={{ flex: 0.6, bgcolor: "#fff", borderRadius: 2, boxShadow: 2, p: 2 }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#d32f2f" }}
        >
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
          events={events.map((evt) => ({
            ...evt,
            color: evt.end ? "#1976d2" : "#d32f2f",
          }))}
          height="75vh"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </Box>
    </Box>
  );
};

export default SectorsStepV2;
