import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";

import moment from "moment";
import useGql from "../../lib/graphql/gql";
import { GET_QUOTE_BY_ID, UPDATE_QUOTE } from "../../lib/graphql/queries/quote";
import { GET_CLIENTS } from "../../lib/graphql/queries/clients";
import { GET_AIRCRAFT } from "../../lib/graphql/queries/aircraft";
import { GET_AIRCRAFT_CATEGORIES } from "../../lib/graphql/queries/aircraft-categories";
import AddIcon from "@mui/icons-material/Add";
import PriceEdit from "../price/edit";

interface AircraftCategory {
  id: string;
  name: string;
}

interface Aircraft {
  id: string;
  name: string;
  category: AircraftCategory;
}

const QuoteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, register } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itinerary",
  });
  const [loading, setLoading] = useState(true);
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

  // Fetch existing quote details

  const fetchQuote = async () => {
    const response = await useGql({
      query: GET_QUOTE_BY_ID,
      queryName: "quote",
      queryType: "query-without-edge",
      variables: { id },
    });

    console.log("response", response);
    if (response) {
      setValue("referenceNo", response.referenceNo);
      setValue("status", response.status);
      setValue("requestedBy", response.requestedBy.id);
      setValue("representative", response.representative);
      setSelectedAircraftCategory(response.category);
      setValue("category", response.category.id);
      setValue("aircraft", response.aircraft.id);
      setValue("itinerary", response.itinerary);
    }

    setLoading(false);
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
    getClients();
    getAircraftCategories();
    getAircrafts(null);

    fetchQuote();
  }, [id, setValue]);

  // Submit updated data
  const onSubmit = async (data) => {
    await useGql({
      query: UPDATE_QUOTE,
      queryName: "updateQuote",
      variables: { id, input: data },
    });
    navigate("/quotes");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Quote
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <Typography sx={{ whiteSpace: "nowrap" }}>Requested by:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="requestedBy"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  value={
                    clients.find((client) => client.id === field.value) || null
                  }
                  onChange={(_, newValue) => field.onChange(newValue?.id || "")}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              )}
            />
          </Grid>

          {/* Representative */}
          <Grid item xs={4}>
            <Typography>Representative:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="representative"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size="small" />
              )}
            />
          </Grid>

          {/* Aircraft Category */}
          <Grid item xs={4}>
            <Typography>Aircraft Category:</Typography>
          </Grid>
          <Grid item xs={8}>
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
                    <TextField {...params} size="small" />
                  )}
                />
              )}
            />
          </Grid>

          {/* Aircraft */}
          <Grid item xs={4}>
            <Typography>Aircraft:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              name="aircraft"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={aircrafts}
                  getOptionLabel={(option) => option.name}
                  value={
                    aircrafts.find((aircraft) => aircraft.id === field.value) ||
                    null
                  }
                  onChange={(_, newValue) => field.onChange(newValue?.id || "")}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Itinerary List */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Itinerary
          </Typography>
          {fields.map((item, index) => (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={item.id}
              sx={{ mb: 1 }}
            >
              <Grid item xs={2}>
                <Controller
                  name={`itinerary.${index}.source`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="ADEP" fullWidth size="small" />
                  )}
                />
              </Grid>

              <Grid item xs={2}>
                <Controller
                  name={`itinerary.${index}.destination`}
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="ADES" fullWidth size="small" />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <Controller
                    name={`itinerary.${index}.depatureDateTime`}
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        value={moment(field.value)}
                        slotProps={{
                          textField: { fullWidth: true, size: "small" },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <Controller
                    name={`itinerary.${index}.arrivalDateTime`}
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        {...field}
                        value={moment(field.value)}
                        slotProps={{
                          textField: { fullWidth: true, size: "small" },
                        }}
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
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={1}>
                <IconButton onClick={() => remove(index)} color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button onClick={() => append({})} variant="contained" sx={{ mt: 2 }}>
            <AddIcon fontSize="small" />
          </Button>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
        >
          Save
        </Button>
      </form>
      <PriceEdit />
    </Paper>
  );
};

export default QuoteEdit;
