import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Box, Grid } from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import AirportsAutocomplete from "../../components/airport-autocommplete";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { Delete } from "@mui/icons-material";
import useGql from "../../lib/graphql/gql";
import { CREATE_QUOTE } from "../../lib/graphql/queries/quote";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { GET_AIRCRAFT } from "../../lib/graphql/queries/aircraft";
import { GET_CLIENTS } from "../../lib/graphql/queries/clients";
import { GET_AIRCRAFT_CATEGORIES } from "../../lib/graphql/queries/aircraft-categories";
import RequestedByDialog from "../../components/client-form";

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

export const QuoteCreate = ({ isNewQuote,setIsNewQuote }) => {

    console.log("isNewQuote::",isNewQuote)

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
  };

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    createQuote(data);
    setIsNewQuote(false);
  };

  const itinerary = watch("itinerary");
  console.log("itinerary", itinerary);

  const addItinerary = () => {
    const lastItinerary = itinerary[itinerary.length - 1];

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

    append(newItinerary);
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
    getAircraftCategories();
    getAircrafts(null);
    getClients();
  }, []);

  useEffect(() => {
    getAircrafts(selectedAircraftCategory?.id);
  }, [selectedAircraftCategory]);

  const handleSubDialogClose = async () => {
    setSubDialogOpen(false);
    await getClients();
  };

  return (
    <>
      <Dialog
        open={isNewQuote}
        onClose={() => setIsNewQuote(false)}
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
                    <IconButton onClick={() => setSubDialogOpen(true)}>
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
                        <Delete fontSize="small" />
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
          <Button onClick={() => setIsNewQuote(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <RequestedByDialog
        subDialogOpen={subDialogOpen}
        handleSubDialogClose={handleSubDialogClose}
      />
    </>
  );
};

export default QuoteCreate;
