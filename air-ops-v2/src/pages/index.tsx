// import * as React from 'react';
// import Typography from '@mui/material/Typography';

// export default function HomePage() {

//   return (
//       <Typography>
//         Welcome to Toolpad Core!
//       </Typography>
//   );
// }
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import useGql from "../lib/graphql/gql";
import { GET_AIRPORTS } from "../lib/graphql/queries/airports";
import AirportsAutocomplete from "../components/airport-autocommplete";
import { GET_AIRCRAFT_CATEGORIES } from "../lib/graphql/queries/aircraft-categories";
import { GET_AIRCRAFT } from "../lib/graphql/queries/aircraft";
import Autocomplete from "@mui/material/Autocomplete";

import "./main.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { Delete } from "@mui/icons-material";
import moment from "moment";
import { GET_CLIENTS } from "../lib/graphql/queries/clients";
import RequestedByDialog from "../components/client-form";
import { CREATE_QUOTE } from "../lib/graphql/queries/quote";

// export const events = [
//   {
//     title: "Conference",
//     start: "2025-01-25",
//     end: "2025-01-27",
//   },
//   {
//     title: "Meeting",
//     start: "2025-01-26T10:30:00+00:00",
//     end: "2025-01-26T12:30:00+00:00",
//   },
//   {
//     title: "Lunch",
//     start: "2025-01-26T12:00:00+00:00",
//   },
//   {
//     title: "Birthday Party",
//     start: "2025-01-27T07:00:00+00:00",
//   },
//   {
//     url: "http://google.com/",
//     title: "Click for Google",
//     start: "2025-01-28",
//   },
// ];

interface AircraftCategory {
  id: string;
  name: string;
}

interface Aircraft {
  id: string;
  name: string;
  category: AircraftCategory;
}

const defaultValues = {
  requestedBy: "",
  representative: "",
  itinerary: [
    {
      date: "",
      time: "",
      departureOrArrival: "departure",
      source: "",
      destination: "",
      paxNumber: 1,
      aircraft: "",
    },
  ],

  providerType: "airops",
  aircraftCategory: "",
};

export default function DashboardPage() {
  const [mainDialogOpen, setMainDialogOpen] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [aircraftCategories, setAircraftCategories] = useState<
    AircraftCategory[]
  >([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [selectedAircraftCategory, setSelectedAircraftCategory] =
    useState<AircraftCategory | null>(null);

  const [events, setEvents] = useState<{ title: string; start: string; end: string }[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itinerary",
  });


  const createQuote = async (formData) => {
    const data = await useGql({
      query: CREATE_QUOTE,
      queryName: "quote",
      variables: {
        input: {
          quote: formData
        }
      },
    });

    console.log("submitted data:", data);
  }

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    createQuote(data);
  };

  const itinerary = watch("itinerary");
  console.log("itinerary", itinerary);

  const addItinerary = () => {
    const lastItinerary = itinerary[itinerary.length - 1];

    console.log("newItinerary", lastItinerary);

    setEvents((prev: any) => [...prev, {
      title: `${lastItinerary.source}-${lastItinerary.destination}`,
      start: lastItinerary?.date,
      end: moment(lastItinerary?.date)
        .add(moment.duration(lastItinerary?.time))
        .format("YYYY-MM-DD HH:mm")
    }]);

    const newItinerary = {
      date: "",
      time: "",
      departureOrArrival: "departure",
      source: lastItinerary ? lastItinerary.destination : "",
      destination: "",
      paxNumber: 1,
      aircraft: ""
    };


    // Append the new itinerary to the existing itinerary list
    append(newItinerary);
  };

  console.log("events", events);

  const [rows, setRows] = useState([
    { id: 1, ADEP: "", ADES: "", TBA: "", dateLT: "", timeLT: "", PAX: "" },
  ]);

  const handleMainDialogOpen = () => {
    setMainDialogOpen(true);
  };

  const handleMainDialogClose = () => {
    setMainDialogOpen(false);
  };

  const handleSubDialogOpen = () => {
    setSubDialogOpen(true);
  };

  const handleSubDialogClose = async () => {
    console.log("Sub Dialog Closed")
    setSubDialogOpen(false);
    await getClients();
  };

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      ADEP: "",
      ADES: "",
      TBA: "",
      dateLT: "",
      timeLT: "",
      PAX: "",
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row,
    );
    setRows(updatedRows);
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
  }

  console.log("selectedAircraftCategory", selectedAircraftCategory);

  useEffect(() => {
    getAircraftCategories();
    getAircrafts(null);
    getClients()
  }, []);

  useEffect(() => {
    getAircrafts(selectedAircraftCategory?.id);
  }, [selectedAircraftCategory]);

  return (
    <div style={{ padding: "20px" }}>
      <Button variant="contained" onClick={handleMainDialogOpen}>
        Add New Quote Request
      </Button>

      {/* Main Dialog */}
      <Dialog
        open={mainDialogOpen}
        onClose={handleMainDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Add New Quote Request</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              gap: "20px",
              border: "1px solid grey",
              padding: "0px 8px",
            }}
          >
            {/* Left Form */}
            {/* <div style={{ flex: 0.5, padding: "5px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "18px" }}>Requested by:</span>
                <TextField
                  select
                  defaultValue="Option 1"
                  variant="outlined"
                  size="small"
                  style={{ width: "40%" }} // Set the width to 30%
                  InputProps={{
                    style: { padding: "0", height: "30px" },
                  }}
                >
                  <MenuItem value="">---</MenuItem>
                  <MenuItem value="John">John</MenuItem>
                </TextField>
                <IconButton onClick={handleSubDialogOpen}>
                  <AddIcon />
                </IconButton>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                <span style={{ marginRight: "8px" }}>Representative:</span>
                <TextField
                  select
                  defaultValue=""
                  variant="outlined"
                  size="small"
                  style={{ width: "40%" }} // Set the width to 30%
                  InputProps={{
                    style: { padding: "0", height: "30px" },
                  }}
                >
                  <MenuItem value="">---</MenuItem>
                  <MenuItem value="Smith">Smith</MenuItem>
                </TextField>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                <span style={{ marginRight: "16px" }}>Min. Category:</span>
                <TextField
                  select
                  defaultValue=""
                  variant="outlined"
                  size="small"
                  style={{ width: "40%" }} // Set the width to 30%
                  InputProps={{
                    style: { padding: "0", height: "30px" },
                  }}
                >
                  <MenuItem value="">---</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                </TextField>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                <span style={{ marginRight: "65.5px" }}>Aircraft:</span>
                <TextField
                  variant="outlined"
                  size="small"
                  style={{ width: "40%" }} // Set the width to 30%
                  InputProps={{
                    style: { padding: "0", height: "30px" },
                  }}
                ></TextField>
              </div>

              <Autocomplete
                disablePortal
                options={aircraftCategories}
                getOptionLabel={(option) => `${option.name}`}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Min. Category" />
                )}
                onChange={(e, value) => setSelectedAircraftCategory(value)}
              />

              <Autocomplete
                disablePortal
                options={aircrafts}
                getOptionLabel={(option) => `${option.name}`}
                sx={{ width: 300 }}
                renderOption={(props, option) => (
                  <li
                    {...props}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span>{`${option.category.name}`}</span>
                    <span style={{ fontWeight: "bold" }}>{option.name}</span>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Aircraft" />
                )}
              />

              <Button variant="contained" color="primary">
                One Way or Multi Leg
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginLeft: "10px" }}
              >
                Round Trip
              </Button>

          
              <div style={{ marginTop: "20px" }}>
                <div className="heading-table">
                  <span>ADEP</span>
                  <span>ADES</span>
                  <span>TBA</span>
                  <span> &nbsp; &nbsp; </span>
                  <span>Date LT</span>
                  <span>Time LT</span>
                  <span>PAX</span>
                </div>
                {rows.map((row) => (
                  <div
                    key={row.id}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                   
                    <AirportsAutocomplete label="ADEP" />
                    <AirportsAutocomplete label="ADES" />
                   
                    <TextField
                      size="small"
                      style={{ width: "10%" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                      margin="normal"
                      value={row.TBA}
                      onChange={(e) =>
                        handleInputChange(row.id, "TBA", e.target.value)
                      }
                    />
                    <TextField
                      select
                      defaultValue=""
                      variant="outlined"
                      size="small"
                      style={{ width: "40%", marginTop: "8px" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                    >
                      <MenuItem value="">---</MenuItem>
                      <MenuItem value="A">A</MenuItem>
                    </TextField>
                    <TextField
                      size="small"
                      style={{ width: "35%" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                      margin="normal"
                      value={row.dateLT}
                      onChange={(e) =>
                        handleInputChange(row.id, "dateLT", e.target.value)
                      }
                    />
                    <TextField
                      size="small"
                      style={{ width: "35%" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                      margin="normal"
                      value={row.timeLT}
                      onChange={(e) =>
                        handleInputChange(row.id, "timeLT", e.target.value)
                      }
                    />
                    <TextField
                      size="small"
                      style={{ width: "35%" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                      margin="normal"
                      value={row.PAX}
                      onChange={(e) =>
                        handleInputChange(row.id, "PAX", e.target.value)
                      }
                    />
                    <IconButton
                      onClick={() => handleDeleteRow(row.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                  style={{ marginTop: "10px" }}
                >
                  Add Row
                </Button>
              </div>
            </div> */}

            <form onSubmit={handleSubmit(onSubmit)} className="form_Work" style={{ padding: "20px", flex: 0.5, }}>
              <Controller
                name="requestedBy"
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ marginRight: '37px' }}>Requested by:</Typography>
                    {/* <TextField
                      {...field}
                      select
                      variant="outlined"
                      size="small"
                      sx={{ width: "40%" }} // Set the width as in the old code
                      InputProps={{
                        sx: { padding: 0, height: "30px" },
                      }}
                    ></TextField> */}
                    <Autocomplete

                      {...field}

                      options={clients}

                      getOptionLabel={(option) => option.name} // Display the category name
                      value={
                        field.value
                          ? clients.find(
                            (client) => client.id === field.value,
                          )
                          : null
                      }
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <IconButton onClick={handleSubDialogOpen}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                )}
              />
              <Controller
                name="representative"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0px",
                    }}
                  >
                    <Typography sx={{ marginRight: '28px' }}>Representative:</Typography>
                    <TextField
                      {...field}
                      style={{ width: '300px' }}
                      margin="normal"
                    />
                  </Box>
                )}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ marginRight: '17px' }}>Aircraft Category:</Typography>
                <Controller
                  name="aircraftCategory"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={aircraftCategories}
                      getOptionLabel={(option) => option.name} // Display the category name
                      value={selectedAircraftCategory} // Ensure value is the full AircraftCategory object
                      onChange={(_, value) => {
                        setSelectedAircraftCategory(value); // Set full object on selection
                        setValue("aircraftCategory", value ? value.id : ""); // Update form value with category ID
                      }}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} />
                      )}
                    />
                  )}
                />
              </Box>


              <Box sx={{ mt: 5 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, auto)", // Creates equal spacing for 7 items
                    gap: 2, // Adds spacing between items
                    fontWeight: "bold",
                    borderBottom: "2px solid #ddd", // Optional: To visually separate the header
                    pb: 1, // Padding bottom for better spacing
                  }}
                >
                  <Typography variant="body2">ADEP</Typography>
                  <Typography variant="body2">ADES</Typography>
                  <Typography variant="body2">Date LT</Typography>
                  <Typography variant="body2">Time LT</Typography>
                  <Typography variant="body2">PAX</Typography>
                  <Typography variant="body2">Aircraft</Typography>
                  <Typography variant="body2"><Delete /></Typography>


                </Box>
                {/* Itinerary Fields */}
                {fields.map((item, index) => (
                  <Grid
                    container
                    spacing={2}
                    key={item.id}
                    sx={{
                      display: "flex",
                      gap: "0px",
                      alignItems: "center",
                      marginTop: '5px'
                    }}
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

                    <Grid item xs={2}>
                      <Controller
                        name={`itinerary.${index}.date`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            // label="Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <Controller
                        name={`itinerary.${index}.time`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            // label="Time"
                            type="time"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>


                    <Grid item xs={1}>
                      <Controller
                        name={`itinerary.${index}.paxNumber`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            // label="Pax Number"
                            type="number"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>

                      <Controller
                        name={`itinerary.${index}.aircraft`}
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            options={aircrafts}
                            getOptionLabel={(option) => option.name} // Display the aircraft name
                            value={
                              field.value
                                ? aircrafts.find(
                                  (aircraft) => aircraft.id === field.value,
                                )
                                : null
                            } // Match the selected aircraft by id
                            onChange={(_, value) => {
                              // Update form state with the selected aircraft's id
                              field.onChange(value ? value.id : ""); // Set the aircraft id in form data
                            }}
                            renderInput={(params) => (
                              <TextField {...params} />
                            )}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={1} container alignItems="center">
                      <IconButton onClick={() => remove(index)} color="error">
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Box sx={{
                  display:"flex"
                }}>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={addItinerary} // Add a new itinerary
                    style={{ marginTop: '10px' }}
                  >
                    {/* Add Itinerary */}
                    +
                  </Button>
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    style={{ marginTop: '10px', marginLeft:"28px" }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </form>

            {/* Right Calendar */}
            <div
              style={{
                flex: 0.5,
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
                  right: "dayGridMonth,timeGridWeek,timeGridDay", // user can switch between the two
                }}
                events={events}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMainDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleMainDialogClose}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sub Dialog */}
      {/* <Dialog open={subDialogOpen} onClose={handleSubDialogClose}>
        <DialogTitle>Add Requested By Details</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" />
          <TextField label="Email" fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubDialogClose}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
      <RequestedByDialog subDialogOpen={subDialogOpen} handleSubDialogClose={handleSubDialogClose} />
    </div>
  );
}
