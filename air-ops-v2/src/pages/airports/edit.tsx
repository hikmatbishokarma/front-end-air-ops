import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";
import {
  GET_AIRCRAFT_DETAIL_BY_ID,
  UPDATE_AIRCRAFT_DETAIL,
} from "../../lib/graphql/queries/aircraft-detail";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  IaircraftCategory,
  Isepcification,
} from "../../interfaces/quote.interface";
import AirportChildren from "./children";
import {
  GET_AIRPORT_BY_ID,
  UPDATE_AIRPORT,
} from "../../lib/graphql/queries/airports";

type FormData = {
  name: string;
  iata_code: string;
  icao_code: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

export const AirportEdit = ({ id, onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const [airport, setAirport] = useState<FormData>();

  const fetchAirportById = async (Id) => {
    const response = await useGql({
      query: GET_AIRPORT_BY_ID,
      queryName: "airport",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setAirport(response);
    }
  };

  useEffect(() => {
    fetchAirportById(id);
  }, [id]);

  useEffect(() => {
    if (airport) {
      setValue("city", airport.city || "false");
      setValue("name", airport.name || "");
      setValue("iata_code", airport.iata_code || "");
      setValue("icao_code", airport.icao_code || "");
      setValue("country", airport.country || "");
      setValue("latitude", airport.latitude || 0);
      setValue("longitude", airport.longitude || 0);
    }
  }, [airport, setValue]);

  const UpdateAirport = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_AIRPORT,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
      refreshList();
      onClose();
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
      latitude:Number(data.latitude),
      longitude:Number(data.longitude)
    };

    UpdateAirport(id, formattedData);
    refreshList();
    onClose();
  };

  const editFields = [
    { name: "name", label: "Airport Name", xs: 6  },
    { name: "iata_code", label: "IATA Code" , xs: 6},
    { name: "icao_code", label: "ICAO Code", xs: 6 },
    { name: "city", label: "City", xs: 6,options:[]  },
    { name: "country", label: "Country", xs: 6 },
    { name: "latitude", label: "Latitude", type: "number", xs: 6 },
    { name: "longitude", label: "Longitude", type: "number", xs: 6 },
  ];

  return (
    <AirportChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={editFields}
    />
  );
};
