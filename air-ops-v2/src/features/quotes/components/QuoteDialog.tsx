import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Autocomplete,
  FormControl,
  FormLabel,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import moment from "moment";
import AirportsAutocomplete from "@/components/airport-autocommplete";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const QuoteRequestDialog = ({
  mainDialogOpen,
  handleMainDialogClose,
  handleSubmit,
  onSubmit,
  control,
  clients,
  aircraftCategories,
  aircrafts,
  fields,
  remove,
  addItinerary,
  events,
  handleSubDialogOpen,
  selectedAircraftCategory,
  setSelectedAircraftCategory,
  setValue,
}) => {
  return (
    <Dialog
      open={mainDialogOpen}
      onClose={handleMainDialogClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid #ddd" }}>
        Add New Quote Request
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Section: Form */}
          <Grid item xs={6}>
            <form onSubmit={handleSubmit(onSubmit)} className="form_Work">
              {/* Requested By */}
              <FormControl fullWidth margin="normal">
                <FormLabel>Requested By</FormLabel>

                <Controller
                  name="requestedBy"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={clients}
                      getOptionLabel={(option) => option.name}
                      value={
                        clients.find((client) => client.id === field.value) ||
                        null
                      }
                      onChange={(_, newValue) =>
                        field.onChange(newValue ? newValue.id : "")
                      }
                      sx={{ flexGrow: 1 }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  )}
                />
                <IconButton onClick={handleSubDialogOpen} color="primary">
                  <AddIcon fontSize="small" />
                </IconButton>
              </FormControl>

              {/* Representative */}
              <FormControl fullWidth margin="normal">
                <FormLabel>Representative</FormLabel>
                <Controller
                  name="representative"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth />}
                />
              </FormControl>

              {/* Aircraft Category */}
              <FormControl fullWidth margin="normal">
                <FormLabel>Aircraft Category</FormLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={aircraftCategories}
                      getOptionLabel={(option) => option.name}
                      value={selectedAircraftCategory}
                      onChange={(_, value) => {
                        setSelectedAircraftCategory(value);
                        setValue("category", value ? value.id : "");
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  )}
                />
              </FormControl>

              {/* Aircraft */}
              <FormControl fullWidth margin="normal">
                <FormLabel>Aircraft</FormLabel>
                <Controller
                  name="aircraft"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={aircrafts}
                      getOptionLabel={(option) => option.name}
                      value={
                        aircrafts.find(
                          (aircraft) => aircraft.id === field.value
                        ) || null
                      }
                      onChange={(_, value) =>
                        field.onChange(value ? value.id : "")
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  )}
                />
              </FormControl>

              {/* Itinerary Section */}
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Itinerary Details
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr) auto",
                    gap: 1,
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
                  <Typography variant="body2"></Typography>
                </Box>

                {fields.map((item, index) => (
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    key={item.id}
                    mt={1}
                  >
                    {/* Source */}
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

                    {/* Destination */}
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

                    {/* Departure Date */}
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

                    {/* Arrival Date */}
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

                    {/* PAX */}
                    <Grid item xs={1}>
                      <Controller
                        name={`itinerary.${index}.paxNumber`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type="number" fullWidth />
                        )}
                      />
                    </Grid>

                    {/* Delete Button */}
                    <Grid item xs={1}>
                      <IconButton onClick={() => remove(index)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}

                {/* Add Itinerary Button */}
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={addItinerary}
                  sx={{ mt: 2 }}
                >
                  + Add Itinerary
                </Button>
              </Box>
            </form>
          </Grid>

          {/* Right Section: Calendar */}
          <Grid item xs={6} sx={{ borderLeft: "1px solid #ddd", pl: 3 }}>
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
          </Grid>
        </Grid>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ borderTop: "1px solid #ddd", p: 2 }}>
        <Button onClick={handleMainDialogClose} color="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuoteRequestDialog;
