import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import {
  CREATE_AIRCRAFT_CATEGORY,
  GET_AIRCRAFT_CATEGORIES,
} from "../../lib/graphql/queries/aircraft-categories";
import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";
import {
  CREATE_AIRCRAFT_DETAIL,
  GET_AIRCRAFT,
} from "../../lib/graphql/queries/aircraft-detail";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AirportChildren from "./children";
import { CREATE_AIRPORT } from "../../lib/graphql/queries/airports";

type FormValues = {
  name: string;
  iata_code: string;
  icao_code: string;
  city: string;
  latitude: number;
  longitude: number;
  country: string;
};

export const AirportCreate = ({ onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      iata_code: "",
      icao_code: "",
      city: "",
      latitude: 0,
      longitude: 0,
      country: "",
    },
  });

  const createFields = [
    { name: "name", label: "Airport Name" },
    { name: "iata_code", label: "IATA Code" },
    { name: "icao_code", label: "ICAO Code", xs: 6 },
    { name: "city", label: "City", xs: 6,options:[] },
    { name: "country", label: "Country", xs: 6 },
    { name: "latitude", label: "Latitude", type: "number", xs: 6 },
    { name: "longitude", label: "Longitude", type: "number", xs: 6 },
  ];

  const CreateAirport = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_AIRPORT,
        queryName: "",
        queryType: "mutation",
        variables: { input: { airport: formData } },
      });

      if (!data || data.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar(data?.errors?.[0]?.message, "error");
      }else  showSnackbar("Created Successfully", "success");
     
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      latitude:Number(data.latitude),
      longitude:Number(data.longitude)
    };

    CreateAirport(formattedData);
    refreshList();
    onClose();
  };

  return (
    <AirportChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={createFields}
    />
  );
};
