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
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import moment from "moment";
import { GET_CLIENTS } from "../lib/graphql/queries/clients";
import RequestedByDialog from "../components/client-form";
import { CREATE_QUOTE, GET_QUOTES } from "../lib/graphql/queries/quote";
import Paper from "@mui/material/Paper";
import { QuoteStatus } from "../lib/utils";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import QuoteRequestDialog from "../components/quote-dialog";

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
      depatureDateTime: "",
      arrivalDateTime: "",
      source: "",
      destination: "",
      paxNumber: 1,
    },
  ],

  providerType: "airops",
  category: "",
  aircraft: "",
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

  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]);
  const [clients, setClients] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);

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
          quote: formData,
        },
      },
    });

    console.log("submitted data:", data);
  };

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    createQuote(data);
    setMainDialogOpen(false);
  };

  const itinerary = watch("itinerary");
  console.log("itinerary", itinerary);

  const addItinerary = () => {
    const lastItinerary = itinerary[itinerary.length - 1];

    console.log("newItinerary", lastItinerary);

    setEvents((prev: any) => [
      ...prev,
      {
        title: `${lastItinerary.source}-${lastItinerary.destination}`,
        start: lastItinerary?.date,
        end: moment(lastItinerary?.date)
          .add(moment.duration(lastItinerary?.time))
          .format("YYYY-MM-DD HH:mm"),
      },
    ]);

    const newItinerary = {
      date: "",
      time: "",
      source: lastItinerary ? lastItinerary.destination : "",
      destination: "",
      depatureDateTime: "",
      arrivalDateTime: "",
      paxNumber: 1,
    };

    // Append the new itinerary to the existing itinerary list
    append(newItinerary);
  };

  console.log("events", events);

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
    console.log("Sub Dialog Closed");
    setSubDialogOpen(false);
    await getClients();
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

  const getQuotes = async () => {
    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query",
        variables: {},
      });
      setRows(() => {
        return data.map((quote: any) => {
          return {
            id: quote.id,
            refrenceNo: quote.referenceNumber,
            status: QuoteStatus[quote.status],
            requester: quote.requestedBy.name,
            // representative: quote.representative.name,
            itinerary: quote.itinerary
              .map((itinerary: any) => {
                return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
              })
              .join(", "),
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log("selectedAircraftCategory", selectedAircraftCategory);

  useEffect(() => {
    getQuotes();
    getAircraftCategories();
    getAircrafts(null);
    getClients();
  }, []);

  useEffect(() => {
    getAircrafts(selectedAircraftCategory?.id);
  }, [selectedAircraftCategory]);

  console.log("rows", rows);

  return (
    <div style={{ padding: "20px" }}>
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Requester</TableCell>
                <TableCell align="right">Itinenary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.refrenceNo}
                  </TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                  <TableCell align="right">{row.requester}</TableCell>
                  <TableCell align="right">{row.itinerary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" onClick={handleMainDialogOpen}>
          Add New Quote Request
        </Button>
      </>

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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="form_Work"
              style={{ padding: "20px", flex: 0.5 }}
            >
              <Controller
                name="requestedBy"
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ marginRight: "37px" }}>
                      Requested by:
                    </Typography>

                    <Autocomplete
                      {...field}
                      options={clients}
                      getOptionLabel={(option) => option.name} // Display the category name
                      value={
                        field.value
                          ? clients.find((client) => client.id === field.value)
                          : null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.id : ""); // Update only the selected value
                      }}
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
                    <Typography sx={{ marginRight: "28px" }}>
                      Representative:
                    </Typography>
                    <TextField
                      {...field}
                      style={{ width: "300px" }}
                      margin="normal"
                    />
                  </Box>
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0px",
                    }}
                  >
                    <Typography sx={{ marginRight: "17px" }}>
                      Aircraft Category:
                    </Typography>
                    <Autocomplete
                      {...field}
                      options={aircraftCategories}
                      getOptionLabel={(option) => option.name}
                      value={selectedAircraftCategory}
                      onChange={(_, value) => {
                        setSelectedAircraftCategory(value);
                        setValue("category", value ? value.id : "");
                      }}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Box>
                )}
              />

              <Controller
                name={`aircraft`}
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ marginRight: "17px" }}>
                      Aircraft:
                    </Typography>
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
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Box>
                )}
              />

              <Box sx={{ mt: 5 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, auto)",
                    gap: 2,
                    fontWeight: "bold",
                    borderBottom: "2px solid #ddd",
                    pb: 1,
                  }}
                >
                  <Typography variant="body2">ADEP</Typography>
                  <Typography variant="body2">ADES</Typography>
                  <Typography variant="body2">DDT</Typography>
                  <Typography variant="body2">ADT LT</Typography>
                  <Typography variant="body2">PAX</Typography>

                  <Typography variant="body2">
                    <Delete />
                  </Typography>
                </Box>

                {fields.map((item, index) => (
                  <Grid
                    container
                    spacing={2}
                    key={item.id}
                    sx={{
                      display: "flex",
                      gap: "0px",
                      alignItems: "center",
                      marginTop: "5px",
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
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Controller
                          name={`itinerary.${index}.depatureDateTime`}
                          control={control}
                          render={({ field }) => (
                            <DateTimePicker
                              {...field}
                              value={field.value ? moment(field.value) : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={2}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Controller
                          name={`itinerary.${index}.arrivalDateTime`}
                          control={control}
                          render={({ field }) => (
                            <DateTimePicker
                              {...field}
                              value={field.value ? moment(field.value) : null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={1}>
                      <Controller
                        name={`itinerary.${index}.paxNumber`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type="number" fullWidth />
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
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={addItinerary}
                    style={{ marginTop: "10px" }}
                  >
                    +
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    style={{ marginTop: "10px", marginLeft: "28px" }}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </form>

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
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
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
      {/* 
<QuoteRequestDialog mainDialogOpen={mainDialogOpen} handleMainDialogClose={handleMainDialogClose} handleSubmit={handleSubmit}
 onSubmit={onsubmit} control={control} clients={clients} aircraftCategories={aircraftCategories}
  aircrafts={aircrafts} fields={fields} remove={remove} addItinerary={addItinerary} events={events}
   handleSubDialogOpen={handleMainDialogClose} selectedAircraftCategory={selectedAircraftCategory} setSelectedAircraftCategory={setSelectedAircraftCategory} setValue={setValue} />
      */}
      <RequestedByDialog
        subDialogOpen={subDialogOpen}
        handleSubDialogClose={handleSubDialogClose}
      />
    </div>
  );
}
