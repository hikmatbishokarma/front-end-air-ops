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
import AirportsAutocomplete from "../../../components/airport-autocommplete";
import {
  getMinDepartureTime,
  validateArrivalAfterDeparture,
  validateArrivalTime,
  validateDepartureTime,
} from "../../../lib/utils";

const SectorsStep = ({ control, watch, getValues, setValue }) => {
  const {
    fields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "itinerary",
  });
  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]);

  const [expanded, setExpanded] = useState<number | false>(0); // first sector open by default

  const itinerary = watch("itinerary", []);

  useEffect(() => {
    const lastIndex = itinerary.length - 1;
    const lastItinerary = itinerary[lastIndex];

    if (
      lastItinerary?.source &&
      lastItinerary?.destination &&
      lastItinerary?.depatureDate &&
      lastItinerary?.arrivalDate &&
      lastItinerary?.depatureTime &&
      lastItinerary?.arrivalTime
    ) {
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

        return updatedEvents;
      });
    }
  }, [JSON.stringify(itinerary)]);

  const handleDatesSet = (dateInfo) => {
    console.log("Calendar dates set:", dateInfo.startStr, dateInfo.endStr);
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

    setExpanded(newIndex); // 👈 open the newly added accordion
  };

  const handleAccordionChange =
    (panel: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // return (
  //   <Box sx={{ display: "flex", mt: 5 }} className="sector-map AccordionSummary_flex">
  //                <Accordion defaultExpanded className="top-border-view1">
  //             <AccordionSummary className="Sector_Typography"
  //               expandIcon={<ExpandMoreIcon />}
  //               aria-controls="panel1-content"
  //               id="panel1-header"
  //             >
  //               <Typography className="add_sectors_size" component="span">Add Sectors</Typography>
  //             </AccordionSummary>
  //             <AccordionDetails>
  //                       <Typography>
  //     <Box sx={{ flex: 0.4, pr: 2 }}>
  //       <LocalizationProvider dateAdapter={AdapterMoment}>
  //         {fields.map((item, index) => {
  //           return (
  //             <Grid
  //               container
  //               spacing={2}
  //               key={item.id}
  //               alignItems="center"
  //               sx={{
  //                 mt: 2,
  //                 borderBottom: "1px solid #ddd",
  //                 pb: 2,
  //               }}
  //             >
  //               {/* Source and Destination */}
  //               <Grid item xs={6} className="fromto">
  //                 <Controller
  //                   name={`itinerary.${index}.source`}
  //                   control={control}
  //                   rules={{ required: "From is required" }}
  //                   render={({ field, fieldState: { error } }) => (
  //                     <AirportsAutocomplete
  //                       {...field}
  //                       label="From"
  //                       isRequired={true}
  //                       error={error}
  //                     />
  //                   )}
  //                 />
  //               </Grid>
  //               <Grid item xs={6} className="fromto">
  //                 <Controller
  //                   name={`itinerary.${index}.destination`}
  //                   control={control}
  //                   rules={{ required: "To is required" }}
  //                   render={({ field, fieldState: { error } }) => (
  //                     <AirportsAutocomplete
  //                       {...field}
  //                       label="To"
  //                       isRequired={true}
  //                       error={error}
  //                     />
  //                   )}
  //                 />
  //               </Grid>

  //               {/* Departure Date and Time */}
  //               <Grid item xs={6} className="fromto">
  //                 <Controller
  //                   name={`itinerary.${index}.depatureDate`}
  //                   control={control}
  //                   rules={{ required: "Date is required" }}
  //                   render={({ field, fieldState: { error } }) => (
  //                     <DatePicker
  //                       {...field}
  //                       format="DD-MM-YYYY"
  //                       value={field.value ? moment(field.value) : null}
  //                       onChange={(newValue) =>
  //                         field.onChange(
  //                           newValue
  //                             ? moment(newValue).format("YYYY-MM-DD")
  //                             : ""
  //                         )
  //                       }
  //                       minDate={moment()}
  //                       slotProps={{
  //                         textField: {
  //                           required: true,
  //                           fullWidth: true,
  //                           size: "small",
  //                           error: !!error,
  //                           helperText: error?.message,
  //                         },
  //                       }}
  //                     />
  //                   )}
  //                 />
  //               </Grid>
  //               <Grid item xs={6} className="fromto">
  //                 <Controller
  //                   name={`itinerary.${index}.depatureTime`}
  //                   control={control}
  //                   rules={{
  //                     required: "Departure time is required",
  //                     validate: (value) =>
  //                       validateDepartureTime(
  //                         watch(`itinerary.${index}.depatureDate`),
  //                         value
  //                       ),
  //                   }}
  //                   render={({ field, fieldState: { error } }) => {
  //                     const depDate = watch(`itinerary.${index}.depatureDate`);
  //                     const minTime = getMinDepartureTime(depDate);

  //                     return (
  //                       <TimeField
  //                         {...field}
  //                         value={
  //                           field.value ? moment(field.value, "HH:mm") : null
  //                         }
  //                         onChange={(newValue) =>
  //                           field.onChange(
  //                             newValue ? moment(newValue).format("HH:mm") : ""
  //                           )
  //                         }
  //                         label="Departure Time"
  //                         size="small"
  //                         format="HH:mm"
  //                         minTime={minTime}
  //                         slotProps={{
  //                           textField: {
  //                             required: true,
  //                             fullWidth: true,
  //                             size: "small",
  //                             error: !!error,
  //                             helperText: error?.message,
  //                           },
  //                         }}
  //                       />
  //                     );
  //                   }}
  //                 />
  //               </Grid>

  //               {/* Arrival Date and Time */}
  //               <Grid item xs={6} className="fromto">
  //                 <Controller
  //                   name={`itinerary.${index}.arrivalDate`}
  //                   control={control}
  //                   rules={{
  //                     required: "Arrival Date is required",
  //                     validate: validateArrivalAfterDeparture(getValues, index),
  //                   }}
  //                   render={({ field, fieldState: { error } }) => {
  //                     const departureDate = watch(
  //                       `itinerary.${index}.depatureDate`
  //                     );
  //                     return (
  //                       <DatePicker
  //                         {...field}
  //                         format="DD-MM-YYYY"
  //                         value={field.value ? moment(field.value) : null}
  //                         onChange={(newValue) =>
  //                           field.onChange(
  //                             newValue
  //                               ? moment(newValue).format("YYYY-MM-DD")
  //                               : ""
  //                           )
  //                         }
  //                         minDate={
  //                           departureDate ? moment(departureDate) : moment()
  //                         }
  //                         slotProps={{
  //                           textField: {
  //                             fullWidth: true,
  //                             size: "small",
  //                             error: !!error,
  //                             helperText: error?.message,
  //                             required: true,
  //                           },
  //                         }}
  //                       />
  //                     );
  //                   }}
  //                 />
  //               </Grid>
  //               <Grid item xs={6} className="fromto">
  //                 <Controller
  //                   name={`itinerary.${index}.arrivalTime`}
  //                   control={control}
  //                   rules={{
  //                     required: "Arrival Time is required",
  //                     validate: validateArrivalTime(getValues, index),
  //                   }}
  //                   render={({ field, fieldState: { error } }) => (
  //                     <TimeField
  //                       {...field}
  //                       value={
  //                         field.value ? moment(field.value, "HH:mm") : null
  //                       }
  //                       onChange={(newValue) =>
  //                         field.onChange(
  //                           newValue ? moment(newValue).format("HH:mm") : ""
  //                         )
  //                       }
  //                       label="Arrival Time"
  //                       size="small"
  //                       format="HH:mm"
  //                       slotProps={{
  //                         textField: {
  //                           required: true,
  //                           fullWidth: true,
  //                           size: "small",
  //                           error: !!error,
  //                           helperText: error?.message,
  //                         },
  //                       }}
  //                     />
  //                   )}
  //                 />
  //               </Grid>

  //               {/* PAX Number and Buttons */}
  //               <Grid item xs={6}>
  //                 <Controller
  //                   name={`itinerary.${index}.paxNumber`}
  //                   control={control}
  //                   rules={{
  //                     min: {
  //                       value: 0,
  //                       message: "PAX must be at least 0",
  //                     },
  //                   }}
  //                   render={({ field, fieldState: { error } }) => (
  //                     <TextField
  //                       {...field}
  //                       type="number"
  //                       fullWidth
  //                       size="small"
  //                       label="PAX"
  //                       error={!!error}
  //                       helperText={error?.message}
  //                       inputProps={{ min: 0 }}
  //                     />
  //                   )}
  //                 />
  //               </Grid>

  //               <Grid
  //                 item
  //                 xs={6}
  //                 sx={{
  //                   display: "flex",
  //                   justifyContent: "flex-end",
  //                 }}
  //               >
  //                 {index < 5 && (
  //                   <IconButton aria-label="add" className="add-icon-v1">
  //                     <AddIcon onClick={addItinerary} />
  //                   </IconButton>
  //                 )}

  //                 {index > 0 && (
  //                   <IconButton aria-label="delete" className="add-icon-v1">
  //                     <DeleteIcon onClick={() => removeItinerary(index)} />
  //                   </IconButton>
  //                 )}
  //               </Grid>
  //             </Grid>
  //           );
  //         })}
  //       </LocalizationProvider>
  //     </Box>
  //     </Typography>
  //     </AccordionDetails>
  //     </Accordion>

  //     {/* Calendar Section */}
  //     <Box
  //       className="calendar-right"
  //       sx={{
  //         flex: 0.6,
  //         backgroundColor: "#fff",
  //         borderLeft: "1px solid grey",
  //         paddingLeft: "8px",
  //       }}
  //     >
  //       <Typography variant="h6" gutterBottom>
  //         Calendar
  //       </Typography>

  //       <FullCalendar
  //         plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
  //         initialView="dayGridMonth"
  //         timeZone="UTC"
  //         headerToolbar={{
  //           left: "prev,next today",
  //           center: "title",
  //           right: "dayGridMonth,timeGridWeek,timeGridDay",
  //         }}
  //         events={events}
  //         datesSet={handleDatesSet}
  //         eventTimeFormat={{
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           hour12: false,
  //         }}
  //         slotLabelFormat={{
  //           hour: "numeric",
  //           minute: "2-digit",
  //           meridiem: "short",
  //         }}
  //       />
  //     </Box>
  //   </Box>
  // );

  return (
    <Box sx={{ display: "flex", mt: 5, gap: 2 }}>
      {/* Left Panel - Sectors */}
      <Box
        sx={{
          flex: 0.4,
          bgcolor: "#e3f2fd", // light blue background
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          {fields.map((item, index) => (
            <Accordion
              key={item.id}
              // defaultExpanded
              expanded={expanded === index}
              onChange={handleAccordionChange(index)}
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
                <Grid container spacing={2} alignItems="center">
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
                        const depDate = watch(
                          `itinerary.${index}.depatureDate`
                        );
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

                  <Grid className="add_delete_data"
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    {index < 5 && (
                      <Button className="add_sector_data_1"
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: "#d32f2f",
                          color: "#d32f2f",
                          "&:hover": { bgcolor: "#d32f2f", color: "#fff" },
                        }}
                        onClick={addItinerary}
                        startIcon={<AddIcon />}
                      >
                        Add
                      </Button>
                    )}

                    {index > 0 && (
                      <Button className="add_sector_data_2"
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          "&:hover": { bgcolor: "#1976d2", color: "#fff" },
                        }}
                        onClick={() => removeItinerary(index)}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </LocalizationProvider>
      </Box>

      {/* Right Panel - Calendar */}
      <Box
        sx={{
          flex: 0.6,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
        }}
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
          events={events.map((evt: any) => ({
            ...evt,
            color: evt.end ? "#1976d2" : "#d32f2f", // arrival = blue, departure = red
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

export default SectorsStep;
